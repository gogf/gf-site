package main

import "C"
import (
    "context"
    "path/filepath"
    "time"

    "github.com/gogf/gf/v2/errors/gerror"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gfile"
    "github.com/sashabaranov/go-openai"
)

const (
    zhDocPath = `/Users/john/Workspace/github/gogf/gf-site/docs`
    enDocPath = `/Users/john/Workspace/github/gogf/gf-site/i18n/en/docusaurus-plugin-content-docs`
    initAIMsg = `
我给你markdown中文内容，你翻译为英文。
`
)

func main() {
    var ctx = context.Background()
    aiClient := openai.NewClient(g.Cfg().MustGet(ctx, "openai.secret").String())
    files, err := gfile.ScanDirFile(zhDocPath, "*.md", true)
    if err != nil {
        panic(err)
    }
    for _, file := range files {
        g.Log().Infof(ctx, `handle: %s`, file)
        relativePath, err := filepath.Rel(zhDocPath, file)
        if err != nil {
            g.Log().Warningf(ctx, "filepath.Rel error: %s", err)
            continue
        }
        enFilePath := gfile.Join(enDocPath, relativePath)
        if gfile.Exists(enFilePath) {
            continue
        }

        content := gfile.GetContents(file)
        newContent, err := doAITrans(ctx, aiClient, content)
        if err != nil {
            g.Log().Warningf(ctx, "doAITrans error: %s", err)
            continue
        }
        _ = gfile.PutContents(enFilePath, newContent)
        time.Sleep(time.Minute)
    }
}

func doAITrans(
    ctx context.Context,
    aiClient *openai.Client,
    fileContent string,
) (string, error) {
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
        return "", err
    }
    if len(resp.Choices) == 0 {
        return "", gerror.New("no response")
    }
    content := resp.Choices[0].Message.Content
    return content, nil
}
