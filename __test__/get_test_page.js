const fs = require('fs');
const https = require('https');


const https_get = (url) => new Promise((resolve, reject) => {
  https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    })
    .on('end', () => {
      resolve(data);
    });
  }).on('error', (err) => {
    reject(err);
  });
});


https_get('https://wades.soe.ucsc.edu/demo-ucsc-website-theme')
.then((str) => {

  str = str
  .replace(/<script src="\/themes\/ucsc_plain\/min\/script\.js\b.*?"/, '<script src="../min/script.js"')    
  .replace(/@import url\("\/themes\/ucsc_plain\/min\/styles\.css\b.*?"\);/, '@import url("../min/styles.css");')  
  .replace(/@import url\("\//g, '@import url("https://wades.soe.ucsc.edu/')
  .replace(/<script src="\//g, '<script src="https://wades.soe.ucsc.edu/')
  .replace(/<img src="\//g, '<img src="https://wades.soe.ucsc.edu/');
  
  fs.writeFileSync('./index.html', str, 'utf8');

});
