const UpyunUpload = require('upyun-uploadfile');
const path = require('path');

new UpyunUpload({
  filePath: './dist',
  upyunName: 'yunupload',
  upyunPath: '/test',
  operatorName: 'file',
  operatorPassword: ''
});