package main

import (
    "context"
    "fmt"

    "github.com/gogf/gf/v2/container/gmap"
    "github.com/gogf/gf/v2/encoding/gjson"
    "github.com/gogf/gf/v2/errors/gerror"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gfile"
    "github.com/gogf/gf/v2/text/gregex"
    "github.com/gogf/gf/v2/text/gstr"
    "github.com/sashabaranov/go-openai"
)

const (
    path      = `/Users/john/Workspace/github/gogf/gf-site/docs`
    initAIMsg = `
我在使用docusaurus构建我的文档网站，目前需要对网页做seo优化。我接下来会给你发markdown文件内容，你帮我自动生成对应的keywords和description，我需要将它们用到markdown文件的front matter中。
你只需要返回用于front matter的keywords和description，其他内容不需要返回。
使用json格式返回，不需要返回markdown代码块。
keywords生成10个，description生成160个汉字。
`
)

var (
    initAIMessages = make([]openai.ChatCompletionMessage, 0)
)

func init() {
    for _, line := range gstr.SplitAndTrim(initAIMsg, "\n") {
        initAIMessages = append(initAIMessages, openai.ChatCompletionMessage{
            Role:    openai.ChatMessageRoleUser,
            Content: line,
        })
    }
}

func main() {
    var ctx = context.Background()
    aiClient := openai.NewClient(g.Cfg().MustGet(ctx, "openai.secret").String())
    files, err := gfile.ScanDirFile(path, "*.md", true)
    if err != nil {
        panic(err)
    }
    for _, file := range files {
        if gstr.Contains(file, "node_modules") {
            continue
        }
        content := gfile.GetContents(file)
        newContent, _ := gregex.ReplaceStringFuncMatch(
            `---\n([\s\S]*?title: [\s\S]+?)\n---`,
            content,
            func(match []string) string {
                var (
                    m     = gmap.NewListMap()
                    lines = gstr.SplitAndTrim(match[1], "\n")
                )
                for _, line := range lines {
                    array := gstr.SplitAndTrim(line, ":")
                    m.Set(array[0], array[1])
                }
                if m.Contains("keywords") {
                    return match[0]
                }
                // ai生成keywords和description
                if err = genKeywordsAndDescription(aiClient, m, content); err != nil {
                    g.Log().Warning(ctx, `genKeywordsAndDescription failed for "%s": %s`, file, err)
                    return match[0]
                }
                // 生成新的front matter
                var newFontMatterContent string
                m.Iterator(func(key, value interface{}) bool {
                    newFontMatterContent += fmt.Sprintf("%s: %s\n", key, value)
                    return true
                })
                return newFontMatterContent
            },
        )
        _ = gfile.PutContents(file, newContent)
    }
}

func genKeywordsAndDescription(
    aiClient *openai.Client,
    m *gmap.ListMap,
    fileContent string,
) error {
    messages := make([]openai.ChatCompletionMessage, len(initAIMessages))
    copy(messages, initAIMessages)
    messages = append(messages, openai.ChatCompletionMessage{
        Role:    openai.ChatMessageRoleUser,
        Content: fileContent,
    })
    resp, err := aiClient.CreateChatCompletion(
        context.Background(),
        openai.ChatCompletionRequest{
            Model:    openai.GPT4o,
            Messages: messages,
        },
    )
    if err != nil {
        return err
    }
    if len(resp.Choices) == 0 {
        return gerror.New("no response")
    }
    content := resp.Choices[0].Message.Content
    j, err := gjson.LoadJson(content)
    if err != nil {
        return err
    }
    for k, v := range j.MapStrAny() {
        m.Set(k, v)
    }
    return nil
}
