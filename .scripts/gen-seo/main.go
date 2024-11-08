package main

import "C"
import (
    "context"
    "fmt"
    "strings"

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
我在使用docusaurus构建我的文档网站，目前需要对网页做seo优化。
我给你发markdown文件内容，你分析该文件内容并生成对应的keywords和description，我需要将它们用到markdown文件的front matter中。
所有涉及到GF或者GF框架关键字的地方，统一使用GoFrame或者GoFrame框架。
你只需要返回用于front matter的keywords和description，其他内容不需要返回。
使用json格式返回，不需要返回markdown代码块。
keywords生成10个，description生成160个汉字。
生成的keywords和description需要符合SEO规范，生成的内容中不能出现seo优化相关的词。
`
)

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
                g.Log().Infof(ctx, `handle %s`, file)
                var (
                    m     = gmap.NewListMap()
                    lines = gstr.SplitAndTrim(match[1], "\n")
                )
                for _, line := range lines {
                    array := strings.SplitN(line, ":", 2)
                    m.Set(gstr.Trim(array[0]), gstr.Trim(array[1]))
                }
                if m.Contains("keywords") && m.Contains("description") {
                    return match[0]
                }
                // ai生成keywords和description
                if err = genKeywordsAndDescription(ctx, aiClient, m, content); err != nil {
                    g.Log().Warningf(ctx, `genKeywordsAndDescription failed for "%s": %s`, file, err)
                    return match[0]
                }
                // 生成新的front matter
                var newFontMatterContent string
                m.Iterator(func(key, value interface{}) bool {
                    newFontMatterContent += fmt.Sprintf("%s: %s\n", key, value)
                    return true
                })
                return "---\n" + gstr.Trim(newFontMatterContent) + "\n---"
            },
        )
        _ = gfile.PutContents(file, newContent)
    }
}

func genKeywordsAndDescription(
    ctx context.Context,
    aiClient *openai.Client,
    m *gmap.ListMap,
    fileContent string,
) error {
    messages := make([]openai.ChatCompletionMessage, 0)
    messages = append(messages, openai.ChatCompletionMessage{
        Role:    openai.ChatMessageRoleUser,
        Content: initAIMsg,
    })
    messages = append(messages, openai.ChatCompletionMessage{
        Role:    openai.ChatMessageRoleUser,
        Content: fileContent,
    })
    resp, err := aiClient.CreateChatCompletion(
        ctx,
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
    var (
        keywords    = j.Get(`keywords`).Strings()
        description = j.Get(`description`).String()
    )
    m.Set("keywords", fmt.Sprintf(`[%s]`, gstr.Join(keywords, ",")))
    m.Set("description", fmt.Sprintf(`'%s'`, description))
    g.Log().Infof(ctx, `generated keywords: %s`, m.Get("keywords"))
    g.Log().Infof(ctx, `generated description: %s`, m.Get("description"))
    return nil
}
