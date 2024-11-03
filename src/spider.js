// src/spider.js
// 定义一个方法，用于爬取网页https://www.coinglass.com/zh/FundingRate网页的内容
// src/spider.js
// src/spider.js
const puppeteer = require('puppeteer-core');
class Rate {
  constructor(exchange, pair, fundingRate) {
    this.exchange = exchange;
    this.pair = pair;
    this.rate = fundingRate;
  }
}
const rateList = [];

async function crawlWebpage(url) {
  try {
    // 启动无头浏览器
    const browser = await puppeteer.launch({
      executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', // 指定 Chrome 的路径
      headless: false // 设置为 false 以便在非无头模式下运行（可选）
    });
    const page = await browser.newPage();

    // 导航到目标URL
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 100000 });

    // 等待页面加载完成
    await page.waitForSelector('#__next > div:nth-child(2) > div.cg-content.MuiBox-root.cg-style-vsqgwu > div.plr20 > div > div:nth-child(2) > div > div.MuiGrid-root.MuiGrid-direction-xs-row.MuiGrid-grid-xs-12.MuiGrid-grid-sm-12.MuiGrid-grid-md-5.cg-style-1qkyzxi > div > div:nth-child(1) > div', { timeout: 50000 });

    // 提取指定元素的内容
    const maxElementContent = await page.$eval('#__next > div:nth-child(2) > div.cg-content.MuiBox-root.cg-style-vsqgwu > div.plr20 > div > div:nth-child(2) > div > div.MuiGrid-root.MuiGrid-direction-xs-row.MuiGrid-grid-xs-12.MuiGrid-grid-sm-12.MuiGrid-grid-md-5.cg-style-1qkyzxi > div > div:nth-child(1) > div', el => el.textContent);

    console.log('提取的元素内容:', maxElementContent);
    // 进一步解析 maxElementContent
    const lines = maxElementContent.split('\n'); // 按换行符分割
    const parsedData = lines.map(line => {
        const parts = line.split(/\s+/); // 按空格分割
        return new Rate (
            parts[0],
            parts[1],
            parts[2]
        );
    });

    // 打印解析后的数据
    console.log('解析后的数据:', parsedData);

    // 等待页面加载完成
    await page.waitForSelector('#__next > div > div.cg-content.MuiBox-root.cg-style-vsqgwu > div.plr20 > div > div:nth-child(2) > div > div.MuiGrid-root.MuiGrid-direction-xs-row.MuiGrid-grid-xs-12.MuiGrid-grid-sm-12.MuiGrid-grid-md-5.cg-style-1qkyzxi > div > div:nth-child(2)', { timeout: 50000 });

    // 提取指定元素的内容
    const minElementContent = await page.$eval('#__next > div > div.cg-content.MuiBox-root.cg-style-vsqgwu > div.plr20 > div > div:nth-child(2) > div > div.MuiGrid-root.MuiGrid-direction-xs-row.MuiGrid-grid-xs-12.MuiGrid-grid-sm-12.MuiGrid-grid-md-5.cg-style-1qkyzxi > div > div:nth-child(2)', el => el.textContent);

    console.log('提取的元素内容:', minElementContent);

    // 关闭浏览器
    await browser.close();
  } catch (error) {
    console.error('Error fetching webpage:', error);
  }
}

// 导出模块，以便其他文件可以使用该方法crawlWebpage
module.exports = {
  crawlWebpage: crawlWebpage,
  rateList: rateList,
  Rate: Rate
};
