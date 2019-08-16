var express = require('express');
var router = express.Router();
var sp = require('google-spreadsheet');
var Promise = require('bluebird');
const MAX_COL_COUNT = 50;
const MAX_ROW_COUNT = 50;
const HEADERS = ['email', 'firstname', 'lastname', 'location'];

router.post('/', async function (req, res, next) {
  try {
    //
    function add(rows) {
      for (let i = 0; i < rows.length; i++) {
        let obj = {};
        obj.firstname = rows[i].firstname;
        obj.lastname = rows[i].lastname;
        obj.email = rows[i].email;
        obj.location = rows[i].location;

        allUsersArray.push(obj);
      }
    }

    let allUsersArray = [];
    let spreadsheetAsync = Promise.promisifyAll(new sp('1NO__2Gw1Z1L_egLy6VxIZstQRbjWKdKGuYdv3VKtul0'));

    //data from google console
    let creds_json = {
      private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC33FPD0tNEVVcG\nnkAHRmBIzGcL8s0bMTNbS5szTums7ty93yrgkIqoM2p5FOvEaT015rVRvaomtLYs\nfQZpXPmPzTea87MKQrta5cdd6AHcT43bmLIRRunOouYntw0HIXsxAw0gwY78OE02\nZ9/92wKXip6s3K/bUhogkDDCVQ+wis9y2ckupd8vh4k8L2PF2EBXUufcyxy0g2sP\njWK9jsGwDlvSj538yrSVp/LA4NiVIcYJL2OKvdc7R4mb1C/k7/aYJVFaF27XTyzn\n6qWv2IyoGnIVT6pDhoPQyjhXGnb4EVi/q/GzE4DU+1ZIfsqnQOkSLqTuQJSIDaWS\nVeheXPXtAgMBAAECggEAGoyiveK6JiJqnCaK2WIUsj5t3OBVNMmAgHzk7t5EyPd/\nAZ3xq5bDpvExvUVDnEuUDq3/XcvU/5zVt4vgOqO118mK74GkR2WGd2Q5yzoe1qjY\nM68Te4IxbejA8lgw9egkSVoG8cVxd8NLhwEt65LOB4L5Ub3WWQW8hxo7KDyvNM8/\nz10rUoFQtfS57ku5WeQfSg3A5/UdU44q7ExQ2sNssoFg69UZZ15jB1GiFO9Ipedf\nDBuAkXUA3wjlvdHc1HzDKbfF/6wjAOkmjegxScmOF0GMcGvcDL3L6ePW4tKfpPSX\n3vQTf06FiGqKxAfCWP9nNq3ZsxiFzbrkWPnPFQhfgwKBgQDlanjRgw3+BO11ZRqd\n1AyU3DjptAidCs+h/U5u6/fXfNL1E8w6DtDcGTWfgeQL4rvEyZjNkJpUpzKY4o3u\n5R80TnsFhKhrWpBKZwO4X1lbjUi/ToqnuaPDNLxGzH2EW851FhtyR2dLIIfTq9xA\nqeAxRPfh3Q3lYIEx0LEpaCwqmwKBgQDNKno96vUNSxQi03O7m5jqrnUP5i+aOQG4\nh8OKTY7ePs7VOwJi7ffVRmTJ552Mup8cizH9pv6d4r1eJ2XAR5tsWKdCuAnrC48P\nHAxR9ZhdyPw0RZdt45QYtewU01OjugZaapOw7XpU3qK8oouCFXXP8VNfPF2obOcj\nuo1HAciGFwKBgQCOZxCnvBmrW5OqEx/6Z+2HWUtahY3zLQrFGl7dK0ukTq8DwU47\nm4a5mExYvl+3oP28oQZgUyn48e/ORpKjf0VnSm/CdR21xXlbNaZxg34L/h7x4Obg\nRbMJMGrN55Dh37q/owFWZkwPrhmhokQNP2USMCVN5dECWGzZZxkRAsCnkQKBgCNh\nne8ro9MFDZXr7Vt/O+HM8DcrtS3dguR11Uz2jxrYrgarxH+XFlRbbWo8XTk1vdbI\nUnix4dsMjSe9l5iPQMhwiXfCEUPNnIA4kA9aUUprLMM+9RxoUNPqG6qDvzrPC+Vv\n18R9T8lvE5WAWpq2ZLjVn1EfMe+nyDyrIU4Liq9FAoGAN8sJAdAs0CqQXuq9Gi6T\nI7C8T/uPh22r4LNDLDZf83mFtrXPqij7BhEIopjUCpMBDI9YkPUGYk5W3l8Hdg2n\nngocZ5lJb9B1JhydMFI9os4Fjk5y99FRkppMFNeCNtXr0wYzZIdufNKhvLAoSxIB\nU7+9YmgJXsUzdOPcMKQe7hQ=\n-----END PRIVATE KEY-----\n",
      client_email: "testsheet@testspreadsheet-250013.iam.gserviceaccount.com",
    }
    //needs to remove \n explicitly
    creds_json.private_key.replace(/\\n/g, '\n');
    //auth
    await spreadsheetAsync.useServiceAccountAuthAsync(creds_json);

    let info = await spreadsheetAsync.getInfoAsync();

    let sheetA = Promise.promisifyAll(info.worksheets[0]);
    let sheetB = Promise.promisifyAll(info.worksheets[1]);
    let rowsA = await sheetA.getRowsAsync({});
    let rowsB = await sheetB.getRowsAsync({});
    add(rowsA);
    add(rowsB);
    
    let uniqueUsersArray = allUsersArray.filter((v, i, a) => a.findIndex((t) => (t.email === v.email && t.firstname === v.firstname && t.lastname === v.lastname)) === i)

    let opt = {
      title: 'C',
      headers: HEADERS
    };

    let needsClean = info.worksheets[2] ? true : false;
    let sheetC = info.worksheets[2] ? Promise.promisifyAll(info.worksheets[2]) :
      await spreadsheetAsync.addWorksheetAsync(opt);

    let rowsC = await sheetB.getRowsAsync({});
    add(rowsC);

    //clean and prepare to new data
    if (needsClean) {
      await sheetC.clearAsync()
      await sheetC.resizeAsync({
        rowCount: MAX_ROW_COUNT,
        colCount: MAX_COL_COUNT
      })
      await sheetC.setHeaderRowAsync(HEADERS)
      await sheetC.setTitleAsync('C')
    }

    for (let i = 0; i < uniqueUsersArray.length; i++) {
      await sheetC.addRowAsync(uniqueUsersArray[i])
    }
    
    //oops. redirects to not handled page /spreadsheet ¯\_(ツ)_/¯
    //@todo: handle it gracefully
    res.status(200).json({});
  } catch (err) {}

});

module.exports = router;
