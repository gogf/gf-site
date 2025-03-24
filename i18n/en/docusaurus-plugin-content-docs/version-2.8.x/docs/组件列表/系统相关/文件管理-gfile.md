---
slug: '/docs/components/os-gfile'
title: 'File'
sidebar_position: 9
hide_title: true
keywords: [GoFrame, gfile, file management, caching mechanism, file operations, directory scanning, file copying, permission settings, path operations, content replacement]
description: "The gfile component provides rich file and directory operations for the GoFrame framework, including file content reading, caching mechanism, file copying and moving, directory scanning, and file permission settings. It supports flexible path operations and content replacement, optimizing file management and processing efficiency, making it an ideal library for developers performing file operations."
---

## Introduction

The `gfile` file management component provides more comprehensive file/directory operation capabilities.

**Usage**:

```go
import "github.com/gogf/gf/v2/os/gfile"
```

**Interface Documentation**:

[https://pkg.go.dev/github.com/gogf/gf/v2/os/gfile](https://pkg.go.dev/github.com/gogf/gf/v2/os/gfile)
:::tip
The following list includes commonly used methods, and the documentation may lag behind new features in the code. For more methods and examples, please refer to the code documentation: [https://pkg.go.dev/github.com/gogf/gf/v2/os/gfile](https://pkg.go.dev/github.com/gogf/gf/v2/os/gfile)
:::
## Content Management

### `GetContents`

- Description: Reads the content of the specified file path and returns it as a string.
- Format:

```go
func GetContents(path string) string
```

- Example:

```go
func ExampleGetContents() {
      // init
      var (
          fileName = "gfile_example.txt"
          tempDir  = gfile.TempDir("gfile_example_content")
          tempFile = gfile.Join(tempDir, fileName)
      )

      // write contents
      gfile.PutContents(tempFile, "goframe example content")

      // It reads and returns the file content as string.
      // It returns empty string if it fails reading, for example, with permission or IO error.
      fmt.Println(gfile.GetContents(tempFile))

      // Output:
      // goframe example content
}
```


### `GetContentsWithCache`

- Description: Reads the file content with caching, allowing for cache timeout settings. The cache is automatically cleared when the file changes.
- Format:

```go
func GetContentsWithCache(path string, duration ...time.Duration) string
```

- Example:

```go
func ExampleGetContentsWithCache() {
      // init
      var (
          fileName = "gfile_example.txt"
          tempDir  = gfile.TempDir("gfile_example_cache")
          tempFile = gfile.Join(tempDir, fileName)
      )

      // write contents
      gfile.PutContents(tempFile, "goframe example content")

      // It reads the file content with cache duration of one minute,
      // which means it reads from cache after then without any IO operations within on minute.
      fmt.Println(gfile.GetContentsWithCache(tempFile, time.Minute))

      // write new contents will clear its cache
      gfile.PutContents(tempFile, "new goframe example content")

      // There's some delay for cache clearing after file content change.
      time.Sleep(time.Second * 1)

      // read contents
      fmt.Println(gfile.GetContentsWithCache(tempFile))

      // May Output:
      // goframe example content
      // new goframe example content
}
```


### `GetBytesWithCache`

- Description: Reads the file content with caching, allowing for cache timeout settings. The cache is automatically cleared when the file changes, and the content is returned as a byte slice.
- Format:

```go
func GetBytesWithCache(path string, duration ...time.Duration) []byte
```

- Example:

```go
func ExampleGetBytesWithCache() {
      // init
      var (
          fileName = "gfile_example.txt"
          tempDir  = gfile.TempDir("gfile_example_cache")
          tempFile = gfile.Join(tempDir, fileName)
      )

      // write contents
      gfile.PutContents(tempFile, "goframe example content")

      // It reads the file content with cache duration of one minute,
      // which means it reads from cache after then without any IO operations within on minute.
      fmt.Println(gfile.GetBytesWithCache(tempFile, time.Minute))

      // write new contents will clear its cache
      gfile.PutContents(tempFile, "new goframe example content")

      // There's some delay for cache clearing after file content change.
      time.Sleep(time.Second * 1)

      // read contents
      fmt.Println(gfile.GetBytesWithCache(tempFile))

      // Output:
      // [103 111 102 114 97 109 101 32 101 120 97 109 112 108 101 32 99 111 110 116 101 110 116]
      // [110 101 119 32 103 111 102 114 97 109 101 32 101 120 97 109 112 108 101 32 99 111 110 116 101 110 116]
}
```


### `GetBytes`

- Description: Reads the content of the specified file path and returns it as a byte slice.
- Format:

```go
func GetBytes(path string) []byte
```

- Example:

```go
func ExampleGetBytes() {
      // init
      var (
          fileName = "gfile_example.txt"
          tempDir  = gfile.TempDir("gfile_example_content")
          tempFile = gfile.Join(tempDir, fileName)
      )

      // write contents
      gfile.PutContents(tempFile, "goframe example content")

      // It reads and returns the file content as []byte.
      // It returns nil if it fails reading, for example, with permission or IO error.
      fmt.Println(gfile.GetBytes(tempFile))

      // Output:
      // [103 111 102 114 97 109 101 32 101 120 97 109 112 108 101 32 99 111 110 116 101 110 116]
}
```


### `GetBytesTilChar`

- Description: Reads the file content up to a specified character and returns the content as a byte slice.
- Format:

```go
func GetBytesTilChar(reader io.ReaderAt, char byte, start int64) ([]byte, int64)
```

- Example:

```go
func ExampleGetBytesTilChar() {
      // init
      var (
          fileName = "gfile_example.txt"
          tempDir  = gfile.TempDir("gfile_example_content")
          tempFile = gfile.Join(tempDir, fileName)
      )

      // write contents
      gfile.PutContents(tempFile, "goframe example content")

      f, _ := gfile.OpenWithFlagPerm(tempFile, os.O_RDONLY, gfile.DefaultPermOpen)

      // GetBytesTilChar returns the contents of the file as []byte
      // until the next specified byte `char` position.
      char, i := gfile.GetBytesTilChar(f, 'f', 0)
      fmt.Println(char)
      fmt.Println(i)

      // Output:
      // [103 111 102]
      // 2
}
```


### `GetBytesByTwoOffsets`

- Description: Reads the file content from the specified range and returns it as a byte slice.
- Format:

```go
func GetBytesByTwoOffsets(reader io.ReaderAt, start int64, end int64) []byte
```

- Example:

```go
func ExampleGetBytesByTwoOffsets() {
      // init
      var (
          fileName = "gfile_example.txt"
          tempDir  = gfile.TempDir("gfile_example_content")
          tempFile = gfile.Join(tempDir, fileName)
      )

      // write contents
      gfile.PutContents(tempFile, "goframe example content")

      f, _ := gfile.OpenWithFlagPerm(tempFile, os.O_RDONLY, gfile.DefaultPermOpen)

      // GetBytesTilChar returns the contents of the file as []byte
      // until the next specified byte `char` position.
      char := gfile.GetBytesByTwoOffsets(f, 0, 3)
      fmt.Println(char)

      // Output:
      // [103 111 102]
}
```


### `PutContents`

- Description: Writes string content to the specified file path. If the file does not exist, it will be created recursively.
- Format:

```go
func putContents(path string, data []byte, flag int, perm os.FileMode) error
```

- Example:

```go
func ExamplePutContents() {
      // init
      var (
          fileName = "gfile_example.txt"
          tempDir  = gfile.TempDir("gfile_example_content")
          tempFile = gfile.Join(tempDir, fileName)
      )

      // It creates and puts content string into specifies file path.
      // It automatically creates directory recursively if it does not exist.
      gfile.PutContents(tempFile, "goframe example content")

      // read contents
      fmt.Println(gfile.GetContents(tempFile))

      // Output:
      // goframe example content
}
```


### `PutBytes`

- Description: Writes bytes to the specified file path. If the file does not exist, it will be created recursively.
- Format:

```go
func PutBytes(path string, content []byte) error
```

- Example:

```go
func ExamplePutBytes() {
      // init
      var (
          fileName = "gfile_example.txt"
          tempDir  = gfile.TempDir("gfile_example_content")
          tempFile = gfile.Join(tempDir, fileName)
      )

      // write contents
      gfile.PutBytes(tempFile, []byte("goframe example content"))

      // read contents
      fmt.Println(gfile.GetContents(tempFile))

      // Output:
      // goframe example content
}
```


### `PutContentsAppend`

- Description: Appends string content to the specified file. If the file does not exist, it will be created recursively.
- Format:

```go
func PutContentsAppend(path string, content string) error
```

- Example:

```go
func ExamplePutContentsAppend() {
      // init
      var (
          fileName = "gfile_example.txt"
          tempDir  = gfile.TempDir("gfile_example_content")
          tempFile = gfile.Join(tempDir, fileName)
      )

      // write contents
      gfile.PutContents(tempFile, "goframe example content")

      // read contents
      fmt.Println(gfile.GetContents(tempFile))

      // It creates and append content string into specifies file path.
      // It automatically creates directory recursively if it does not exist.
      gfile.PutContentsAppend(tempFile, " append content")

      // read contents
      fmt.Println(gfile.GetContents(tempFile))

      // Output:
      // goframe example content
      // goframe example content append content
}
```


### `PutBytesAppend`

- Description: Appends byte content to the specified file. If the file does not exist, it will be created recursively.
- Format:

```go
func PutBytesAppend(path string, content []byte) error
```

- Example:

```go
func ExamplePutBytesAppend() {
      // init
      var (
          fileName = "gfile_example.txt"
          tempDir  = gfile.TempDir("gfile_example_content")
          tempFile = gfile.Join(tempDir, fileName)
      )

      // write contents
      gfile.PutContents(tempFile, "goframe example content")

      // read contents
      fmt.Println(gfile.GetContents(tempFile))

      // write contents
      gfile.PutBytesAppend(tempFile, []byte(" append"))

      // read contents
      fmt.Println(gfile.GetContents(tempFile))

      // Output:
      // goframe example content
      // goframe example content append
}
```


### `GetNextCharOffset`

- Description: Gets the index of the specified character from a certain offset in the file.
- Format:

```go
func GetNextCharOffset(reader io.ReaderAt, char byte, start int64) int64
```

- Example:

```go
func ExampleGetNextCharOffset() {
      // init
      var (
          fileName = "gfile_example.txt"
          tempDir  = gfile.TempDir("gfile_example_content")
          tempFile = gfile.Join(tempDir, fileName)
      )

      // write contents
      gfile.PutContents(tempFile, "goframe example content")

      f, err := gfile.OpenWithFlagPerm(tempFile, os.O_RDONLY, DefaultPermOpen)
      defer f.Close()

      // read contents
      index := gfile.GetNextCharOffset(f, 'f', 0)
      fmt.Println(index)

      // Output:
      // 2
}
```


### `GetNextCharOffsetByPath`

- Description: Gets the index of the specified character from a certain offset in the file.
- Format:

```go
func GetNextCharOffsetByPath(path string, char byte, start int64) int64
```

- Example:

```go
func ExampleGetNextCharOffsetByPath() {
      // init
      var (
          fileName = "gfile_example.txt"
          tempDir  = gfile.TempDir("gfile_example_content")
          tempFile = gfile.Join(tempDir, fileName)
      )

      // write contents
      gfile.PutContents(tempFile, "goframe example content")

      // read contents
      index := gfile.GetNextCharOffsetByPath(tempFile, 'f', 0)
      fmt.Println(index)

      // Output:
      // 2
}
```


### `GetBytesTilCharByPath`

- Description: Reads the file content up to a specified character and returns the content as a byte slice.
- Format:

```go
func GetBytesTilCharByPath(path string, char byte, start int64) ([]byte, int64)
```

- Example:

```go
func ExampleGetBytesTilCharByPath() {
      // init
      var (
          fileName = "gfile_example.txt"
          tempDir  = gfile.TempDir("gfile_example_content")
          tempFile = gfile.Join(tempDir, fileName)
      )

      // write contents
      gfile.PutContents(tempFile, "goframe example content")

      // read contents
      fmt.Println(gfile.GetBytesTilCharByPath(tempFile, 'f', 0))

      // Output:
      // [103 111 102] 2
}
```


### `GetBytesByTwoOffsetsByPath`

- Description: Reads the content of the specified file between two offsets and returns it as a byte slice.
- Format:

```go
func GetBytesByTwoOffsetsByPath(path string, start int64, end int64) []byte
```

- Example:

```go
func ExampleGetBytesByTwoOffsetsByPath() {
      // init
      var (
          fileName = "gfile_example.txt"
          tempDir  = gfile.TempDir("gfile_example_content")
          tempFile = gfile.Join(tempDir, fileName)
      )

      // write contents
      gfile.PutContents(tempFile, "goframe example content")

      // read contents
      fmt.Println(gfile.GetBytesByTwoOffsetsByPath(tempFile, 0, 7))

      // Output:
      // [103 111 102 114 97 109 101]
}
```


### `ReadLines`

- Description: Reads file content line by line as a string.
- Format:

```go
func ReadLines(file string, callback func(text string) error) error
```

- Example:

```go
func ExampleReadLines() {
      // init
      var (
          fileName = "gfile_example.txt"
          tempDir  = gfile.TempDir("gfile_example_content")
          tempFile = gfile.Join(tempDir, fileName)
      )

      // write contents
      gfile.PutContents(tempFile, "L1 goframe example content\nL2 goframe example content")

      // read contents
      gfile.ReadLines(tempFile, func(text string) error {
          // Process each line
          fmt.Println(text)
          return nil
      })

      // Output:
      // L1 goframe example content
      // L2 goframe example content
}
```


### `ReadLinesBytes`

- Description: Reads file content line by line as bytes.
- Format:

```go
func ReadLinesBytes(file string, callback func(bytes []byte) error) error
```

- Example:

```go
func ExampleReadLinesBytes() {
      // init
      var (
          fileName = "gfile_example.txt"
          tempDir  = gfile.TempDir("gfile_example_content")
          tempFile = gfile.Join(tempDir, fileName)
      )

      // write contents
      gfile.PutContents(tempFile, "L1 goframe example content\nL2 goframe example content")

      // read contents
      gfile.ReadLinesBytes(tempFile, func(bytes []byte) error {
          // Process each line
          fmt.Println(bytes)
          return nil
      })

      // Output:
      // [76 49 32 103 111 102 114 97 109 101 32 101 120 97 109 112 108 101 32 99 111 110 116 101 110 116]
      // [76 50 32 103 111 102 114 97 109 101 32 101 120 97 109 112 108 101 32 99 111 110 116 101 110 116]
}
```


### `Truncate`

- Description: Truncates the file to the specified size.
- Note: If the given file path is a symlink, it will modify the source file.
- Format:

```go
func Truncate(path string, size int) error
```

- Example:

```go
func ExampleTruncate(){
      // init
      var (
          path = gfile.Join(gfile.TempDir("gfile_example_basic_dir"), "file1")
      )

      // Check whether the `path` size
      stat, _ := gfile.Stat(path)
      fmt.Println(stat.Size())

      // Truncate file
      gfile.Truncate(path, 0)

      // Check whether the `path` size
      stat, _ = gfile.Stat(path)
      fmt.Println(stat.Size())

      // Output:
      // 13
      // 0
}
```


## Content Replacement

### `ReplaceFile`

- Description: Replaces specified content in the file with new content.
- Format:

```go
func ReplaceFile(search, replace, path string) error
```

- Example:

```go
func ExampleReplaceFile() {
      // init
      var (
          fileName = "gfile_example.txt"
          tempDir  = gfile.TempDir("gfile_example_replace")
          tempFile = gfile.Join(tempDir, fileName)
      )

      // write contents
      gfile.PutContents(tempFile, "goframe example content")

      // read contents
      fmt.Println(gfile.GetContents(tempFile))

      // It replaces content directly by file path.
      gfile.ReplaceFile("content", "replace word", tempFile)

      fmt.Println(gfile.GetContents(tempFile))

      // Output:
      // goframe example content
      // goframe example replace word
}
```


### `ReplaceFileFunc`

- Description: Replaces the content of the specified file using a custom function.
- Format:

```go
func ReplaceFileFunc(f func(path, content string) string, path string) error
```

- Example:

```go
func ExampleReplaceFileFunc() {
      // init
      var (
          fileName = "gfile_example.txt"
          tempDir  = gfile.TempDir("gfile_example_replace")
          tempFile = gfile.Join(tempDir, fileName)
      )

      // write contents
      gfile.PutContents(tempFile, "goframe example 123")

      // read contents
      fmt.Println(gfile.GetContents(tempFile))

      // It replaces content directly by file path and callback function.
      gfile.ReplaceFileFunc(func(path, content string) string {
          // Replace with regular match
          reg, _ := regexp.Compile(`\d{3}`)
          return reg.ReplaceAllString(content, "[num]")
      }, tempFile)

      fmt.Println(gfile.GetContents(tempFile))

      // Output:
      // goframe example 123
      // goframe example [num]
}
```


### `ReplaceDir`

- Description: Scans the specified directory and replaces the specified content in matching files with new content.
- Format:

```go
func ReplaceDir(search, replace, path, pattern string, recursive ...bool) error
```

- Example:

```go
func ExampleReplaceDir() {
      // init
      var (
          fileName = "gfile_example.txt"
          tempDir  = gfile.TempDir("gfile_example_replace")
          tempFile = gfile.Join(tempDir, fileName)
      )

      // write contents
      gfile.PutContents(tempFile, "goframe example content")

      // read contents
      fmt.Println(gfile.GetContents(tempFile))

      // It replaces content of all files under specified directory recursively.
      gfile.ReplaceDir("content", "replace word", tempDir, "gfile_example.txt", true)

      // read contents
      fmt.Println(gfile.GetContents(tempFile))

      // Output:
      // goframe example content
      // goframe example replace word
}
```


### `ReplaceDirFunc`

- Description: Scans the specified directory and uses a custom function to replace the specified content in matching files with new content.
- Format:

```go
func ReplaceDirFunc(f func(path, content string) string, path, pattern string, recursive ...bool) error
```

- Example:

```go
func ExampleReplaceDirFunc() {
      // init
      var (
          fileName = "gfile_example.txt"
          tempDir  = gfile.TempDir("gfile_example_replace")
          tempFile = gfile.Join(tempDir, fileName)
      )

      // write contents
      gfile.PutContents(tempFile, "goframe example 123")

      // read contents
      fmt.Println(gfile.GetContents(tempFile))

      // It replaces content of all files under specified directory with custom callback function recursively.
      gfile.ReplaceDirFunc(func(path, content string) string {
          // Replace with regular match
          reg, _ := regexp.Compile(`\d{3}`)
          return reg.ReplaceAllString(content, "[num]")
      }, tempDir, "gfile_example.txt", true)

      fmt.Println(gfile.GetContents(tempFile))

      // Output:
      // goframe example 123
      // goframe example [num]
}
```


## File Time

### `MTime`

- Description: Gets the modification time of the path.
- Format:

```go
func MTime(path string) time.Time
```

- Example:

```go
func ExampleMTime() {
      t := gfile.MTime(gfile.TempDir())
      fmt.Println(t)

      // May Output:
      // 2021-11-02 15:18:43.901141 +0800 CST
}
```


### `MTimestamp`

- Description: Gets the modification timestamp (seconds) of the path.
- Format:

```go
func MTimestamp(path string) int64
```

- Example:

```go
func ExampleMTimestamp() {
      t := gfile.MTimestamp(gfile.TempDir())
      fmt.Println(t)

      // May Output:
      // 1635838398
}
```


### `MTimestampMilli`

- Description: Gets the modification timestamp (milliseconds) of the path.
- Format:

```go
func MTimestampMilli(path string) int64
```

- Example:

```go
func ExampleMTimestampMilli() {
      t := gfile.MTimestampMilli(gfile.TempDir())
      fmt.Println(t)

      // May Output:
      // 1635838529330
}
```


## File Size

### `Size`

- Description: Gets the size of the path without formatting.
- Format:

```go
func Size(path string) int64
```

- Example:

```go
func ExampleSize() {
      // init
      var (
          fileName = "gfile_example.txt"
          tempDir  = gfile.TempDir("gfile_example_size")
          tempFile = gfile.Join(tempDir, fileName)
      )

      // write contents
      gfile.PutContents(tempFile, "0123456789")
      fmt.Println(gfile.Size(tempFile))

      // Output:
      // 10
}
```


### `SizeFormat`

- Description: Gets the size of the path and formats it as a disk capacity.
- Format:

```go
func SizeFormat(path string) string
```

- Example:

```go
func ExampleSizeFormat() {
      // init
      var (
          fileName = "gfile_example.txt"
          tempDir  = gfile.TempDir("gfile_example_size")
          tempFile = gfile.Join(tempDir, fileName)
      )

      // write contents
      gfile.PutContents(tempFile, "0123456789")
      fmt.Println(gfile.SizeFormat(tempFile))

      // Output:
      // 10.00B
}
```


### `ReadableSize`

- Description: Gets the capacity size of the given path and formats it in a human-readable disk capacity format.
- Format:

```go
func ReadableSize(path string) string
```

- Example:

```go
func ExampleReadableSize() {
      // init
      var (
          fileName = "gfile_example.txt"
          tempDir  = gfile.TempDir("gfile_example_size")
          tempFile = gfile.Join(tempDir, fileName)
      )

      // write contents
      gfile.PutContents(tempFile, "01234567899876543210")
      fmt.Println(gfile.ReadableSize(tempFile))

      // Output:
      // 20.00B
}
```


### `StrToSize`

- Description: Converts a disk capacity size string to a size integer.
- Format:

```go
func StrToSize(sizeStr string) int64
```

- Example:

```go
func ExampleStrToSize() {
      size := gfile.StrToSize("100MB")
      fmt.Println(size)

      // Output:
      // 104857600
}
```


### `FormatSize`

- Description: Converts a size integer to a disk capacity size string using `K, m, g, t, p, e, b`.
- Format:

```go
func FormatSize(raw int64) string
```

- Example:

```go
func ExampleFormatSize() {
      sizeStr := gfile.FormatSize(104857600)
      fmt.Println(sizeStr)
      sizeStr0 := gfile.FormatSize(1024)
      fmt.Println(sizeStr0)
      sizeStr1 := gfile.FormatSize(999999999999999999)
      fmt.Println(sizeStr1)

      // Output:
      // 100.00M
      // 1.00K
      // 888.18P
}
```


## File Sorting

### `SortFiles`

- Description: Sorts multiple paths alphabetically, with numbers taking precedence.
- Format:

```go
func SortFiles(files []string) []string
```

- Example:

```go
func ExampleSortFiles() {
      files := []string{
          "/aaa/bbb/ccc.txt",
          "/aaa/bbb/",
          "/aaa/",
          "/aaa",
          "/aaa/ccc/ddd.txt",
          "/bbb",
          "/0123",
          "/ddd",
          "/ccc",
      }
      sortOut := gfile.SortFiles(files)
      fmt.Println(sortOut)

      // Output:
      // [/0123 /aaa /aaa/ /aaa/bbb/ /aaa/bbb/ccc.txt /aaa/ccc/ddd.txt /bbb /ccc /ddd]
}
```


## File Search

### `Search`

- Description: Searches for files in the specified directory (default includes the current directory, execution directory, and main function directory; does not recurse subdirectories) and returns the real path.
- Format:

```go
func Search(name string, prioritySearchPaths ...string) (realPath string, err error)
```

- Example:

```go
func ExampleSearch() {
      // init
      var (
          fileName = "gfile_example.txt"
          tempDir  = gfile.TempDir("gfile_example_search")
          tempFile = gfile.Join(tempDir, fileName)
      )

      // write contents
      gfile.PutContents(tempFile, "goframe example content")

      // search file
      realPath, _ := gfile.Search(fileName, tempDir)
      fmt.Println(gfile.Basename(realPath))

      // Output:
      // gfile_example.txt
}
```


## Directory Scanning

### `ScanDir`

- Description: Scans the specified directory and can scan files or directories, supporting recursive scans.
- Format:

```go
func ScanDir(path string, pattern string, recursive ...bool) ([]string, error)
```

- Example:

```go
func ExampleScanDir() {
      // init
      var (
          fileName = "gfile_example.txt"
          tempDir  = gfile.TempDir("gfile_example_scan_dir")
          tempFile = gfile.Join(tempDir, fileName)

          tempSubDir  = gfile.Join(tempDir, "sub_dir")
          tempSubFile = gfile.Join(tempSubDir, fileName)
      )

      // write contents
      gfile.PutContents(tempFile, "goframe example content")
      gfile.PutContents(tempSubFile, "goframe example content")

      // scans directory recursively
      list, _ := gfile.ScanDir(tempDir, "*", true)
      for _, v := range list {
          fmt.Println(gfile.Basename(v))
      }

      // Output:
      // gfile_example.txt
      // sub_dir
      // gfile_example.txt
}
```


### `ScanDirFile`

- Description: Scans the files in the specified directory, supporting recursive scanning.
- Format:

```go
func ScanDirFile(path string, pattern string, recursive ...bool) ([]string, error)
```

- Example:

```go
func ExampleScanDirFile() {
      // init
      var (
          fileName = "gfile_example.txt"
          tempDir  = gfile.TempDir("gfile_example_scan_dir_file")
          tempFile = gfile.Join(tempDir, fileName)

          tempSubDir  = gfile.Join(tempDir, "sub_dir")
          tempSubFile = gfile.Join(tempSubDir, fileName)
      )

      // write contents
      gfile.PutContents(tempFile, "goframe example content")
      gfile.PutContents(tempSubFile, "goframe example content")

      // scans directory recursively exclusive of directories
      list, _ := gfile.ScanDirFile(tempDir, "*.txt", true)
      for _, v := range list {
          fmt.Println(gfile.Basename(v))
      }

      // Output:
      // gfile_example.txt
      // gfile_example.txt
}
```


### `ScanDirFunc`

- Description: Scans the specified directory (with custom filtering method), can scan files or directories, and supports recursive scans.
- Format:

```go
func ScanDirFunc(path string, pattern string, recursive bool, handler func(path string) string) ([]string, error)
```

- Example:

```go
func ExampleScanDirFunc() {
      // init
      var (
          fileName = "gfile_example.txt"
          tempDir  = gfile.TempDir("gfile_example_scan_dir_func")
          tempFile = gfile.Join(tempDir, fileName)

          tempSubDir  = gfile.Join(tempDir, "sub_dir")
          tempSubFile = gfile.Join(tempSubDir, fileName)
      )

      // write contents
      gfile.PutContents(tempFile, "goframe example content")
      gfile.PutContents(tempSubFile, "goframe example content")

      // scans directory recursively
      list, _ := gfile.ScanDirFunc(tempDir, "*", true, func(path string) string {
          // ignores some files
          if gfile.Basename(path) == "gfile_example.txt" {
              return ""
          }
          return path
      })
      for _, v := range list {
          fmt.Println(gfile.Basename(v))
      }

      // Output:
      // sub_dir
}
```


### `ScanDirFileFunc`

- Description: Scans the files in the specified directory (with custom filtering method), supporting recursive scans.
- Format:

```go
func ScanDirFileFunc(path string, pattern string, recursive bool, handler func(path string) string) ([]string, error)
```

- Example:

```go
func ExampleScanDirFileFunc() {
      // init
      var (
          fileName = "gfile_example.txt"
          tempDir  = gfile.TempDir("gfile_example_scan_dir_file_func")
          tempFile = gfile.Join(tempDir, fileName)

          fileName1 = "gfile_example_ignores.txt"
          tempFile1 = gfile.Join(tempDir, fileName1)

          tempSubDir  = gfile.Join(tempDir, "sub_dir")
          tempSubFile = gfile.Join(tempSubDir, fileName)
      )

      // write contents
      gfile.PutContents(tempFile, "goframe example content")
      gfile.PutContents(tempFile1, "goframe example content")
      gfile.PutContents(tempSubFile, "goframe example content")

      // scans directory recursively exclusive of directories
      list, _ := gfile.ScanDirFileFunc(tempDir, "*.txt", true, func(path string) string {
          // ignores some files
          if gfile.Basename(path) == "gfile_example_ignores.txt" {
              return ""
          }
          return path
      })
      for _, v := range list {
          fmt.Println(gfile.Basename(v))
      }

      // Output:
      // gfile_example.txt
      // gfile_example.txt
}
```


## Common Directories

### `Pwd`

- Description: Gets the current working path.
- Format:

```go
func Pwd() string
```

- Example:

```go
func ExamplePwd() {
      // Get absolute path of current working directory.
      fmt.Println(gfile.Pwd())

      // May Output:
      // xxx/gf/os/gfile
}
```


### `Home`

- Description: Gets the home directory of the executing user.
- Format:

```go
func Home(names ...string) (string, error)
```

- Example:

```go
func ExampleHome() {
      // user's home directory
      homePath, _ := gfile.Home()
      fmt.Println(homePath)

      // May Output:
      // C:\Users\hailaz
}
```


### `Temp`

- Description: Gets the absolute path after appending the system temporary path.

- Format:

```go
func Temp(names ...string) string
```

- Example:

```go
func ExampleTempDir() {
      // init
      var (
          fileName = "gfile_example_basic_dir"
      )

      // fetch an absolute representation of path.
      path := gfile.Temp(fileName)

      fmt.Println(path)

      // Output:
      // /tmp/gfile_example_basic_dir
}
```


### `SelfPath`

- Description: Gets the absolute path of the current running program.

- Format:

```go
func SelfPath() string
```

- Example:

```go
func ExampleSelfPath() {

      // Get absolute file path of current running process
      fmt.Println(gfile.SelfPath())

      // May Output:
      // xxx/___github_com_gogf_gf_v2_os_gfile__ExampleSelfPath
}
```


## Type Judgment

### `IsDir`

- Description: Checks if the given path is a directory.
- Format:

```go
func IsDir(path string) bool
```

- Example:

```go
func ExampleIsDir() {
      // init
      var (
          path     = gfile.TempDir("gfile_example_basic_dir")
          filePath = gfile.Join(gfile.TempDir("gfile_example_basic_dir"), "file1")
      )
      // Checks whether given `path` a directory.
      fmt.Println(gfile.IsDir(path))
      fmt.Println(gfile.IsDir(filePath))

      // Output:
      // true
      // false
}
```


### `IsFile`

- Description: Checks if the given path is a file.
- Format:

```go
func IsFile(path string) bool
```

- Example:

```go
func ExampleIsFile() {
      // init
      var (
          filePath = gfile.Join(gfile.TempDir("gfile_example_basic_dir"), "file1")
          dirPath  = gfile.TempDir("gfile_example_basic_dir")
      )
      // Checks whether given `path` a file, which means it's not a directory.
      fmt.Println(gfile.IsFile(filePath))
      fmt.Println(gfile.IsFile(dirPath))

      // Output:
      // true
      // false
}
```


## Permission Operations

### `IsReadable`

- Description: Checks if the given path is readable.

- Format:

```go
func IsReadable(path string) bool
```

- Example:

```go
func ExampleIsReadable() {
      // init
      var (
          path = gfile.Pwd() + gfile.Separator + "testdata/readline/file.log"
      )

      // Checks whether given `path` is readable.
      fmt.Println(gfile.IsReadable(path))

      // Output:
      // true
}
```


### `IsWritable`

- Description: Checks if the specified path is writable. If the path is a directory, a temporary file is created to check if it is writable. If it is a file, it is checked if it can be opened.

- Format:

```go
func IsWritable(path string) bool
```

- Example:

```go
func ExampleIsWritable() {
      // init
      var (
          path = gfile.Pwd() + gfile.Separator + "testdata/readline/file.log"
      )

      // Checks whether given `path` is writable.
      fmt.Println(gfile.IsWritable(path))

      // Output:
      // true
}
```


### `Chmod`

- Description: Changes the file permissions of the specified path to the specified permissions.

- Format:

```go
func Chmod(path string, mode os.FileMode) error
```

- Example:

```go
func ExampleChmod() {
      // init
      var (
          path = gfile.Join(gfile.TempDir("gfile_example_basic_dir"), "file1")
      )

      // Get a FileInfo describing the named file.
      stat, err := gfile.Stat(path)
      if err != nil {
          fmt.Println(err.Error())
      }
      // Show original mode
      fmt.Println(stat.Mode())

      // Change file model
      gfile.Chmod(path, gfile.DefaultPermCopy)

      // Get a FileInfo describing the named file.
      stat, _ = gfile.Stat(path)
      // Show the modified mode
      fmt.Println(stat.Mode())

      // Output:
      // -rw-r--r--
      // -rwxrwxrwx
}
```


## File/Directory Operations

### `Mkdir`

- Description: Creates a directory, supporting recursive creation (absolute paths are recommended). The created directory permissions are: `drwxr-xr-x`.
- Format:

```go
func Mkdir(path string) error
```

- Example:

```go
func ExampleMkdir() {
      // init
      var (
          path = gfile.TempDir("gfile_example_basic_dir")
      )

      // Creates directory
      gfile.Mkdir(path)

      // Check if directory exists
      fmt.Println(gfile.IsDir(path))

      // Output:
      // true
}
```


### `Create`

- Description: Creates a file/directory. If the directory in the path does not exist, it will automatically create the directory and file. The created file permissions are `-rw-r–r–`.
- Note: If the created file already exists, it will clear the file's content!
- Format:

```go
func Create(path string) (*os.File, error)
```

- Example:

```go
func ExampleCreate() {
      // init
      var (
          path     = gfile.Join(gfile.TempDir("gfile_example_basic_dir"), "file1")
          dataByte = make([]byte, 50)
      )
      // Check whether the file exists
      isFile := gfile.IsFile(path)

      fmt.Println(isFile)

      // Creates file with given `path` recursively
      fileHandle, _ := gfile.Create(path)
      defer fileHandle.Close()

      // Write some content to file
      n, _ := fileHandle.WriteString("hello goframe")

      // Check whether the file exists
      isFile = gfile.IsFile(path)

      fmt.Println(isFile)

      // Reset file uintptr
      unix.Seek(int(fileHandle.Fd()), 0, 0)
      // Reads len(b) bytes from the File
      fileHandle.Read(dataByte)

      fmt.Println(string(dataByte[:n]))

      // Output:
      // false
      // true
      // hello goframe
}
```


### `Open`

- Description: Opens a file/directory in read-only mode.
- Format:

```go
func Open(path string) (*os.File, error)
```

- Example:

```go
func ExampleOpen() {
      // init
      var (
          path     = gfile.Join(gfile.TempDir("gfile_example_basic_dir"), "file1")
          dataByte = make([]byte, 4096)
      )
      // Open file or directory with READONLY model
      file, _ := gfile.Open(path)
      defer file.Close()

      // Read data
      n, _ := file.Read(dataByte)

      fmt.Println(string(dataByte[:n]))

      // Output:
      // hello goframe
}
```


### `OpenFile`

- Description: Opens a file/directory with the specified `flag` and `perm`.
- Format:

```go
func OpenFile(path string, flag int, perm os.FileMode) (*os.File, error)
```

- Example:

```go
func ExampleOpenFile() {
      // init
      var (
          path     = gfile.Join(gfile.TempDir("gfile_example_basic_dir"), "file1")
          dataByte = make([]byte, 4096)
      )
      // Opens file/directory with custom `flag` and `perm`
      // Create if file does not exist,it is created in a readable and writable mode,prem 0777
      openFile, _ := gfile.OpenFile(path, os.O_CREATE|os.O_RDWR, gfile.DefaultPermCopy)
      defer openFile.Close()

      // Write some content to file
      writeLength, _ := openFile.WriteString("hello goframe test open file")

      fmt.Println(writeLength)

      // Read data
      unix.Seek(int(openFile.Fd()), 0, 0)
      n, _ := openFile.Read(dataByte)

      fmt.Println(string(dataByte[:n]))

      // Output:
      // 28
      // hello goframe test open file
}
```


### `OpenWithFalg`

- Description: Opens a file/directory with the specified `flag`.
- Format:

```go
func OpenWithFlag(path string, flag int) (*os.File, error)
```

- Example:

```go
func ExampleOpenWithFlag() {
      // init
      var (
          path     = gfile.Join(gfile.TempDir("gfile_example_basic_dir"), "file1")
          dataByte = make([]byte, 4096)
      )

      // Opens file/directory with custom `flag`
      // Create if file does not exist,it is created in a readable and writable mode with default `perm` is 0666
      openFile, _ := gfile.OpenWithFlag(path, os.O_CREATE|os.O_RDWR)
      defer openFile.Close()

      // Write some content to file
      writeLength, _ := openFile.WriteString("hello goframe test open file with flag")

      fmt.Println(writeLength)

      // Read data
      unix.Seek(int(openFile.Fd()), 0, 0)
      n, _ := openFile.Read(dataByte)

      fmt.Println(string(dataByte[:n]))

      // Output:
      // 38
      // hello goframe test open file with flag
}
```


### `OpenWithFalgPerm`

- Description: Opens a file/directory with the specified `flag` and `perm`.
- Format:

```go
func OpenWithFlagPerm(path string, flag int, perm os.FileMode) (*os.File, error)
```

- Example:

```go
func ExampleOpenWithFlagPerm() {
      // init
      var (
          path     = gfile.Join(gfile.TempDir("gfile_example_basic_dir"), "file1")
          dataByte = make([]byte, 4096)
      )

      // Opens file/directory with custom `flag` and `perm`
      // Create if file does not exist,it is created in a readable and writable mode with  `perm` is 0777
      openFile, _ := gfile.OpenWithFlagPerm(path, os.O_CREATE|os.O_RDWR, gfile.DefaultPermCopy)
      defer openFile.Close()

      // Write some content to file
      writeLength, _ := openFile.WriteString("hello goframe test open file with flag and perm")

      fmt.Println(writeLength)

      // Read data
      unix.Seek(int(openFile.Fd()), 0, 0)
      n, _ := openFile.Read(dataByte)

      fmt.Println(string(dataByte[:n]))

      // Output:
      // 38
      // hello goframe test open file with flag
}
```


### `Stat`

- Description: Gets the file information of the given path.
- Format:

```go
func Stat(path string) (os.FileInfo, error)
```

- Example:

```go
func ExampleStat() {
      // init
      var (
          path = gfile.Join(gfile.TempDir("gfile_example_basic_dir"), "file1")
      )
      // Get a FileInfo describing the named file.
      stat, _ := gfile.Stat(path)

      fmt.Println(stat.Name())
      fmt.Println(stat.IsDir())
      fmt.Println(stat.Mode())
      fmt.Println(stat.ModTime())
      fmt.Println(stat.Size())
      fmt.Println(stat.Sys())

      // May Output:
      // file1
      // false
      // -rwxr-xr-x
      // 2021-12-02 11:01:27.261441694 +0800 CST
      // &{16777220 33261 1 8597857090 501 20 0 [0 0 0 0] {1638414088 192363490} {1638414087 261441694} {1638414087 261441694} {1638413480 485068275} 38 8 4096 0 0 0 [0 0]}
}
```


### `Copy`

- Description: Supports copying files or directories.
- Format:

```go
func Copy(src string, dst string) error
```

- Example:

```go
func ExampleCopy() {
      // init
      var (
          srcFileName = "gfile_example.txt"
          srcTempDir  = gfile.TempDir("gfile_example_copy_src")
          srcTempFile = gfile.Join(srcTempDir, srcFileName)

          // copy file
          dstFileName = "gfile_example_copy.txt"
          dstTempFile = gfile.Join(srcTempDir, dstFileName)

          // copy dir
          dstTempDir = gfile.TempDir("gfile_example_copy_dst")
      )

      // write contents
      gfile.PutContents(srcTempFile, "goframe example copy")

      // copy file
      gfile.Copy(srcTempFile, dstTempFile)

      // read contents after copy file
      fmt.Println(gfile.GetContents(dstTempFile))

      // copy dir
      gfile.Copy(srcTempDir, dstTempDir)

      // list copy dir file
      fList, _ := gfile.ScanDir(dstTempDir, "*", false)
      for _, v := range fList {
          fmt.Println(gfile.Basename(v))
      }

      // Output:
      // goframe example copy
      // gfile_example.txt
      // gfile_example_copy.txt
}
```


### `CopyFile`

- Description: Copies a file.
- Format:

```go
func CopyFile(src, dst string) (err error)
```

- Example:

```go
func ExampleCopyFile() {
      // init
      var (
          srcFileName = "gfile_example.txt"
          srcTempDir  = gfile.TempDir("gfile_example_copy_src")
          srcTempFile = gfile.Join(srcTempDir, srcFileName)

          // copy file
          dstFileName = "gfile_example_copy.txt"
          dstTempFile = gfile.Join(srcTempDir, dstFileName)
      )

      // write contents
      gfile.PutContents(srcTempFile, "goframe example copy")

      // copy file
      gfile.CopyFile(srcTempFile, dstTempFile)

      // read contents after copy file
      fmt.Println(gfile.GetContents(dstTempFile))

      // Output:
      // goframe example copy
}
```


### `CopyDir`

- Description: Supports copying files or directories.
- Format:

```go
func CopyDir(src string, dst string) error
```

- Example:

```go
func ExampleCopyDir() {
      // init
      var (
          srcTempDir  = gfile.TempDir("gfile_example_copy_src")

          // copy file
          dstFileName = "gfile_example_copy.txt"
          dstTempFile = gfile.Join(srcTempDir, dstFileName)

          // copy dir
          dstTempDir = gfile.TempDir("gfile_example_copy_dst")
      )
      // read contents after copy file
      fmt.Println(gfile.GetContents(dstTempFile))

      // copy dir
      gfile.CopyDir(srcTempDir, dstTempDir)

      // list copy dir file
      fList, _ := gfile.ScanDir(dstTempDir, "*", false)
      for _, v := range fList {
          fmt.Println(gfile.Basename(v))
      }

      // Output:
      // gfile_example.txt
      // gfile_example_copy.txt
}
```


### `Move`

- Description: Renames `src` to `dst`.

- Note: If `dst` already exists and is a file, it will be replaced, potentially causing data loss.
- Format:

```go
func Move(src string, dst string) error
```

- Example:

```go
func ExampleMove() {
      // init
      var (
          srcPath = gfile.Join(gfile.TempDir("gfile_example_basic_dir"), "file1")
          dstPath = gfile.Join(gfile.TempDir("gfile_example_basic_dir"), "file2")
      )
      // Check is file
      fmt.Println(gfile.IsFile(dstPath))

      //  Moves `src` to `dst` path.
      // If `dst` already exists and is not a directory, it'll be replaced.
      gfile.Move(srcPath, dstPath)

      fmt.Println(gfile.IsFile(srcPath))
      fmt.Println(gfile.IsFile(dstPath))

      // Output:
      // false
      // false
      // true
}
```


### `Rename`

- Description: Alias for `Move`, renames `src` to `dst`.

- Note: If `dst` already exists and is a file, it will be replaced, potentially causing data loss.
- Format:

```go
func Rename(src string, dst string) error
```

- Example:

```go
func ExampleRename() {
      // init
      var (
          srcPath = gfile.Join(gfile.TempDir("gfile_example_basic_dir"), "file2")
          dstPath = gfile.Join(gfile.TempDir("gfile_example_basic_dir"), "file1")
      )
      // Check is file
      fmt.Println(gfile.IsFile(dstPath))

      //  renames (moves) `src` to `dst` path.
      // If `dst` already exists and is not a directory, it'll be replaced.
      gfile.Rename(srcPath, dstPath)

      fmt.Println(gfile.IsFile(srcPath))
      fmt.Println(gfile.IsFile(dstPath))

      // Output:
      // false
      // false
      // true
}
```


### `Remove`

- Description: Deletes the file or directory at the given path.

- Format:

```go
func Remove(path string) error
```

- Example:

```go
func ExampleRemove() {
      // init
      var (
          path = gfile.Join(gfile.TempDir("gfile_example_basic_dir"), "file1")
      )

      // Checks whether given `path` a file, which means it's not a directory.
      fmt.Println(gfile.IsFile(path))

      // deletes all file/directory with `path` parameter.
      gfile.Remove(path)

      // Check again
      fmt.Println(gfile.IsFile(path))

      // Output:
      // true
      // false
}
```


### `IsEmpty`

- Description: Checks if the given path is empty, if a directory, checks if it contains files; if a file, checks if the file size is empty.

- Format:

```go
func IsEmpty(path string) bool
```

- Example:

```go
func ExampleIsEmpty() {
      // init
      var (
          path = gfile.Join(gfile.TempDir("gfile_example_basic_dir"), "file1")
      )

      // Check whether the `path` is empty
      fmt.Println(gfile.IsEmpty(path))

      // Truncate file
      gfile.Truncate(path, 0)

      // Check whether the `path` is empty
      fmt.Println(gfile.IsEmpty(path))

      // Output:
      // false
      // true
}
```


### `DirNames`

- Description: Gets the list of files under the given path and returns them as a slice.

- Format:

```go
func DirNames(path string) ([]string, error)
```

- Example:

```go
func ExampleDirNames() {
      // init
      var (
          path = gfile.TempDir("gfile_example_basic_dir")
      )
      // Get sub-file names of given directory `path`.
      dirNames, _ := gfile.DirNames(path)

      fmt.Println(dirNames)

      // May Output:
      // [file1]
}
```


### `Glob`

- Description: Fuzzy search for the file list under the given path, supports regex, the second parameter controls whether to return the results with absolute paths.

- Format:

```go
func Glob(pattern string, onlyNames ...bool) ([]string, error)
```

- Example:

```go
func ExampleGlob() {
      // init
      var (
          path = gfile.Pwd() + gfile.Separator + "*_example_basic_test.go"
      )
      // Get sub-file names of given directory `path`.
      // Only show file name
      matchNames, _ := gfile.Glob(path, true)

      fmt.Println(matchNames)

      // Show full path of the file
      matchNames, _ = gfile.Glob(path, false)

      fmt.Println(matchNames)

      // May Output:
      // [gfile_z_example_basic_test.go]
      // [xxx/gf/os/gfile/gfile_z_example_basic_test.go]
}
```


### `Exists`

- Description: Checks if the given path exists.
- Format:

```go
func Exists(path string) bool
```

- Example:

```go
func ExampleExists() {
      // init
      var (
          path = gfile.Join(gfile.TempDir("gfile_example_basic_dir"), "file1")
      )
      // Checks whether given `path` exist.
      fmt.Println(gfile.Exists(path))

      // Output:
      // true
}
```


### `Chdir`

- Description: Changes the current working path to the given path.
- Format:

```go
func Chdir(dir string) error
```

- Example:

```go
func ExampleChdir() {
      // init
      var (
          path = gfile.Join(gfile.TempDir("gfile_example_basic_dir"), "file1")
      )
      // Get current working directory
      fmt.Println(gfile.Pwd())

      // Changes the current working directory to the named directory.
      gfile.Chdir(path)

      // Get current working directory
      fmt.Println(gfile.Pwd())

      // May Output:
      // xxx/gf/os/gfile
      // /tmp/gfile_example_basic_dir/file1
}
```


## Path Operations

### `Join`

- Description: Joins multiple string paths with `/`.
- Format:

```go
func Join(paths ...string) string
```

- Example:

```go
func ExampleJoin() {
      // init
      var (
          dirPath  = gfile.TempDir("gfile_example_basic_dir")
          filePath = "file1"
      )

      // Joins string array paths with file separator of current system.
      joinString := gfile.Join(dirPath, filePath)

      fmt.Println(joinString)

      // Output:
      // /tmp/gfile_example_basic_dir/file1
}
```


### `Abs`

- Description: Returns the absolute path of the given path.

- Format:

```go
func Abs(path string) string
```

- Example:

```go
func ExampleAbs() {
      // init
      var (
          path = gfile.Join(gfile.TempDir("gfile_example_basic_dir"), "file1")
      )

      // Get an absolute representation of path.
      fmt.Println(gfile.Abs(path))

      // Output:
      // /tmp/gfile_example_basic_dir/file1
}
```


### `RealPath`

- Description: Gets the absolute path of the given path.

- Note: Returns empty if the file does not exist.

- Format:

```go
func RealPath(path string) string
```

- Example:

```go
func ExampleRealPath() {
      // init
      var (
          realPath  = gfile.Join(gfile.TempDir("gfile_example_basic_dir"), "file1")
          worryPath = gfile.Join(gfile.TempDir("gfile_example_basic_dir"), "worryFile")
      )

      // fetch an absolute representation of path.
      fmt.Println(gfile.RealPath(realPath))
      fmt.Println(gfile.RealPath(worryPath))

      // Output:
      // /tmp/gfile_example_basic_dir/file1
      //
}
```


### `SelfName`

- Description: Gets the name of the current running program.

- Format:

```go
func SelfName() string
```

- Example:

```go
func ExampleSelfName() {

      // Get file name of current running process
      fmt.Println(gfile.SelfName())

      // May Output:
      // ___github_com_gogf_gf_v2_os_gfile__ExampleSelfName
}
```


### `Basename`

- Description: Gets the last element of the given path, including the extension.

- Format:

```go
func Basename(path string) string
```

- Example:

```go
func ExampleBasename() {
      // init
      var (
          path = gfile.Pwd() + gfile.Separator + "testdata/readline/file.log"
      )

      // Get the last element of path, which contains file extension.
      fmt.Println(gfile.Basename(path))

      // Output:
      // file.log
}
```


### `Name`

- Description: Gets the last element of the given path, excluding the extension.

- Format:

```go
func Name(path string) string
```

- Example:

```go
func ExampleName() {
      // init
      var (
          path = gfile.Pwd() + gfile.Separator + "testdata/readline/file.log"
      )

      // Get the last element of path without file extension.
      fmt.Println(gfile.Name(path))

      // Output:
      // file
}
```


### `Dir`

- Description: Gets the directory part of the given path, excluding the last element.

- Format:

```go
func Dir(path string) string
```

- Example:

```go
func ExampleDir() {
      // init
      var (
          path = gfile.Join(gfile.TempDir("gfile_example_basic_dir"), "file1")
      )

      // Get all but the last element of path, typically the path's directory.
      fmt.Println(gfile.Dir(path))

      // Output:
      // /tmp/gfile_example_basic_dir
}
```


### `Ext`

- Description: Gets the extension of the given path, including `.`.

- Format:

```go
func Ext(path string) string
```

- Example:

```go
func ExampleExt() {
      // init
      var (
          path = gfile.Pwd() + gfile.Separator + "testdata/readline/file.log"
      )

      // Get the file name extension used by path.
      fmt.Println(gfile.Ext(path))

      // Output:
      // .log
}
```


### `ExtName`

- Description: Gets the extension of the given path, excluding `.`.

- Format:

```go
func ExtName(path string) string
```

- Example:

```go
func ExampleExtName() {
      // init
      var (
          path = gfile.Pwd() + gfile.Separator + "testdata/readline/file.log"
      )

      // Get the file name extension used by path but the result does not contains symbol '.'.
      fmt.Println(gfile.ExtName(path))

      // Output:
      // log
}
```


### `MainPkgPath`

- Description: Gets the absolute path of the main file (entry point) location.

- Note:
  - `This method is only available in the development environment and is only effective in the source code development environment. It will display the source code path after building the binary.`
  - `If the method is called for the first time in an asynchronous goroutine, it may not be able to get the path of the main package.`
- Format:

```go
func MainPkgPath() string
```

- Example:

```go
func Test() {
      fmt.Println("main pkg path on main :", gfile.MainPkgPath())
      char := make(chan int, 1)
      go func() {
          fmt.Println("main pkg path on goroutine :", gfile.MainPkgPath())
          char <- 1
      }()
      select {
      case <-char:
      }
      // Output:
      // /xxx/xx/xxx/xx
      // /xxx/xx/xxx/xx
}
// Binary package
$ ./testDemo
main pkg path on main : /xxx/xx/xxx/xx
main pkg path on goroutine : /xxx/xx/xxx/xx
```