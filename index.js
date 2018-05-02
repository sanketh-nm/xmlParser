let parser = require('xml2json');
let Promise = require('bluebird');
let fs = Promise.promisifyAll(require('fs'));

//var Connection = require('tedious').Connection;

let UPCs =[];
// let connection = new Connection(config);

// connection.on('connect', function(err) {
//     // If no error, then good to go...
//         executeSQL();
//     }
//   );

let xmlstring = "";
let fileList = "";

fs.readdirAsync('pc').then(suc => {
        fileList = suc;
        //console.log(fileList);
        getUPCs(fileList);
    })
    .catch(err => {
        console.log(err);
    })


function getUPCs(fileList) {
    // return new Promise(function(resolve,reject){
    fileList.forEach(element => {
        //if(element.includes('xml')){
        fs.readFileAsync('pc/'+element)
            .then(suc => {
                xmlstring = suc.toString();
                //console.log(xmlstring);
                let jsonstring = parser.toJson(xmlstring);
                let jsonobj = JSON.parse(jsonstring);
                //console.log(JSON.stringify(jsonobj.Orders.Order.LineItems.LineItem));
                //let OrderLine = "";
                let LineItem = "";
                let count =0;
                for (LineItem of jsonobj.Orders.Order.LineItems.LineItem) {
                    count ++;
                }
                // for (OrderLine of jsonobj.Orders.Order.LineItem) {
                //     if(OrderLine.OrderLine.ConsumerPackageCode){
                //         count ++;
                //         //UPCs.push(OrderLine.OrderLine.UPCCaseCode);
                //         //console.log("'"+OrderLine.OrderLine.ConsumerPackageCode+"',")
                //     }
                //     //console.log("-------------------------")
                // }
                console.log(jsonobj.Orders.Order.Header.OrderHeader.PurchaseOrderNumber+","+ count);
            })
            .catch(err => console.log(err));
    //}
});

    
}

function executeSQL( UPCs){

    var Request = require('tedious').Request;  
    request = new Request("select * from M3FDBGRD.MVXJDTA.MITPOP where MPPOPN IN "+UPCs);
    let result ="";
    request.on('row', function(columns) {  
        columns.forEach(function(column) {  
            console.log(column.metadata.colName);
        //   if (column.name === "OACUOR") {  
        //     console.log(column.value);  
        //   } else {  
        //     //result+= column.value + " ";  
        //   }  
        });  
        console.log(result);  
        console.log("-------------------------");  
        result ="";  
    });  

    request.on('done', function(rowCount) {  
    console.log(rowCount + ' rows returned');  
    });  
    connection.execSql(request); 
}

