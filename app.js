const http = require('http');
const url = require('url');
const querystring = require('querystring');
const fs = require('fs');

const server = http.createServer(function(req,res){
			   
			   let parsedURL = url.parse(req.url);
			   let path = parsedURL.pathname;
	  		 var params = querystring.parse(parsedURL.query);
	  		 res.writeHead(200,"ok");
	  		   //Networking
         let mymethod = req.method.toLowerCase() ;
    if(mymethod=='get'){
 		   if(path=='/books'){
 			res.write(fs.readFileSync('book.html','utf-8'));
      }
 		  else if(path=='/books/bookslist.txt'){
 			res.write(fs.readFileSync('bookslist.txt','utf-8'));
      }
      else if(path=='/books/del'){
        // la suppression avec splice 
        
        
          console.log("le lien "+params['id']);
       
        
      }
 	  	else {
 			res.write("the path requested doesn't exit in this server GET method");
 		  }
 	  }
 	  else if(mymethod=='post'){
      if(path=='/books/add'){
 		    let body = '';
        req.on('data', function (data) {
            body += data;
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (body.length > 1e6) { 
                // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
                req.connection.destroy();
            }
         });
        req.on('end', function () {
         
         let output  = querystring.parse(body);
         let input = '\n'+getUniqueId()+';'+output.bname+';'+output.bdate;

         fs.appendFile('bookslist.txt',input,function(err){
          if(err) throw err ;
          console.log("should be updated");
         });
          console.log("NO MORE DATA");
         });
        res.write(fs.readFileSync('book.html','utf-8'));
      }
      else {
      res.write("the path requested doesn't exit in this server POST method");
      }
  }
 	res.end();

});
function getUniqueId(){
  let maintab = fs.readFileSync('bookslist.txt','utf-8').split("\n");
  let nbre_ligne = maintab.length ; 
  let subtab;
  let value ; 
  console.log(nbre_ligne);
  if(nbre_ligne===0){
    value = 1;
    console.log('value');
  }
  else if(nbre_ligne>0){
   for(let i=0;i<nbre_ligne;i++){
    subtab = maintab[i].split(';');
   }
   
  }
  return value ; 
}

server.on('close',function(){console.log('we are closing');});
server.listen(1234,function(){console.log('i am listening ');});