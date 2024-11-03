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
      headless: true // 设置为 false 以便在非无头模式下运行（可选）
    });
    const page = await browser.newPage();

    // 导航到目标URL
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 100000 });


    await page.waitForSelector('.MuiBox-root.cg-style-wa2shg', { timeout: 50000 });
    // 提取所有指定元素的内容
    const elements = await page.$$eval('.MuiBox-root.cg-style-wa2shg', elements => 
        elements.map(el => {
          const childElements = el.childNodes; // 获取所有子元素
          const aTagContent = childElements[0]?.textContent || "";
          const divTagContent = childElements[1]?.textContent || '';
          return { aTagContent, divTagContent };
        }));
    elements.forEach(element => {
      // 提取a标签的文本内容并用空格符分割
      const parts = element.aTagContent.split(/\s+/); // 按空格分割
      const divTagContent = element.divTagContent || '';
      rateList.push(new Rate(parts[0], parts[1], parseFloat(divTagContent)));
    });

    console.log('提取的所有元素内容:', elements);
    console.log('rateList:', rateList);
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
