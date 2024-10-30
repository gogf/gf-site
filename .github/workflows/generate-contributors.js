const fs = require("fs")
const sharp = require('sharp')

// github api url
const githubUrl = `https://api.github.com/repos/gogf/gf/contributors`

// 生成 svg 的位置
const svgPath = "../../static/img/contributors.svg"
// 单个头像压缩放大比例, 尽量是整数, 配合 quality 可以有效压缩图片并保证清晰度
const scaleFactor = 2
// 单个头像的质量, 1 - 100
const quality = 30

// 单个头像的宽高
const width = 54, height = 54
// 头像之间的间距
const xSpace = 4, ySpace = 4
// 每一行的头像数量
const row = 20

getContributors().then(contributors => {
    genSvg(contributors).then(r => {
        console.log(`${svgPath} 生成成功, 一共 ${contributors.length} 个贡献者`)
    })
}).catch(error => {
    console.error(error)
})

// getContributors 获取所有的贡献者
async function getContributors() {
    const contributors = []
    let page = 1
    let per_page = 100
    let hasMore = true

    while (hasMore) {
        const response = await fetch(`${githubUrl}?page=${page}&per_page=${per_page}`)
        const data = await response.json()

        if (response.status !== 200) {
            throw new Error(`Failed to fetch contributors: ${response.statusText}`)
        }

        contributors.push(...data)

        if (data.length < per_page) {
            hasMore = false
        } else {
            page++
        }
    }

    return contributors
}

// genSvg 生成 svg 文件
async function genSvg(data) {
    let contributorsArr = chunkArray(data, row)

    // 计算整个 svg 的宽高
    let svgWidth = (width + xSpace) * row + xSpace
    let svgHeight = (height + ySpace) * contributorsArr.length + ySpace

    // 创建 svg 内容
    let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${svgWidth}" height="${svgHeight}"><style> .gf-svg { cursor:pointer } </style>`

    // x 表示头像的 x 坐标，y 表示头像的 y 坐标
    // 初始从左上角开始
    let x = xSpace, y = ySpace
    let n = 0
    for (const contributors of contributorsArr) {
        for (const contributor of contributors) {
            svgContent += await generateAvatar(contributor, x, y)
            console.log(`生成第 ${++n} 个贡献者: ${contributor.login}`)
            x += width + xSpace
        }

        // 换行
        x = xSpace
        y += height + ySpace
    }

    svgContent += `</svg>`

    // 精简 svg 内容
    svgContent = svgContent.replace(/>\s+</g, "><")

    // 保存 svg 文件
    fs.writeFileSync(svgPath, svgContent)
}

// chunkArray 函数用于将数组拆分为指定大小的块
function chunkArray(array, chunkSize) {
    const result = []
    for (let i = 0; i < array.length; i += chunkSize) {
        result.push(array.slice(i, i + chunkSize))
    }
    return result
}

// generateAvatar 生成一个base64格式的头像的 svg 代码
//
// <defs xmlns="http://www.w3.org/2000/svg">
//     <clipPath id="clip-oldme-git">
//         <circle cx="273" cy="17" r="15"/>
//     </clipPath>
// </defs>
// <a xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="gf-svg" target="_blank" rel="nofollow" xlink:href="https://github.com/oldme-git" id="oldme-git">
//     <image x="258" y="2" width="30" height="30" xlink:href="data:image/png;base64,..." clip-path="url(#clip-oldme-git)/>
// </a>
async function generateAvatar(contributor, x, y) {
    const base64Image = await convertImageToBase64(contributor.avatar_url)
    const clipPathId = `clip-${contributor.login}`

    return `<defs><clipPath id="${clipPathId}"><circle cx="${x + width / 2}" cy="${y + height / 2}" r="${width / 2}" /></clipPath></defs>
    <a class="gf-svg" target="_blank" rel="nofollow" xlink:href="${contributor.html_url}" id="${contributor.login}">
      <image x="${x}" y="${y}" width="${width}" height="${height}" xlink:href="${base64Image}" clip-path="url(#${clipPathId})"/>
    </a>
    `
}

// convertImageToBase64 将 url 中的图片转换为 base64 格式
async function convertImageToBase64(url) {
    const response = await fetch(url)
    const buffer = await response.arrayBuffer()

    const compressedBuffer = await sharp(Buffer.from(buffer))
        .toFormat("jpeg", { quality })
        .toBuffer()
    const base64Image = compressedBuffer.toString("base64")

    return `data:image/jpeg;base64,${base64Image}`
}