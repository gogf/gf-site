package main

import (
    "fmt"

    "github.com/gogf/gf/v2/container/gmap"
    "github.com/gogf/gf/v2/os/gfile"
    "github.com/gogf/gf/v2/text/gregex"
    "github.com/gogf/gf/v2/text/gstr"
)

const (
    path = `/Users/john/Workspace/github/gogf/gf-site/docs`
)

func main() {
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
                genKeywordsAndDescription(m)
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

func genKeywordsAndDescription(m *gmap.ListMap) {

}
