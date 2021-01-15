//import packages
const csv = require('csv-parser');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;




var RawCsvData =[];
var VolunteerEdges = [];

//read data from csv file

fs.createReadStream('volunteer_attendance_data.csv')
  .pipe(csv())
  .on('data', (row) => {
      RawCsvData.push(row)
      
    
  })
  .on('end', () => {

    //initialize to store output data array

    const csv1 = new Set()
    const csv2 = new Set()
    

    //get the edges from rawdata

    for(let i=0;i<RawCsvData.length;i++)
    {
        
       RawCsvData.filter((vol)=>{
            
            if(vol.date===RawCsvData[i].date&&vol.shift===RawCsvData[i].shift&&vol.volunteerId !== RawCsvData[i].volunteerId)
            {
                VolunteerEdges.push([RawCsvData[i].volunteerName,vol.volunteerName])
            }
        
        
        }) 
     
    }
    
    //store data 

    for(let volunteer of VolunteerEdges)
    {
          
       const NumOfEdges = VolunteerEdges.filter(value=>value[0]==volunteer[0]&&value[1]==volunteer[1])
       let check = 0;
       
       for(value of csv1){

          if(value[0]===volunteer[1]&&value[1]===volunteer[0]||value[0]===volunteer[0]&&value[1]===volunteer[1])
             check=1;
          

       }

       if(check===0)
       {
            csv1.add([volunteer[0],volunteer[1]])
            csv2.add([volunteer[0],volunteer[1],NumOfEdges.length])
       }
       

    }




  
   //intitalise array of object to write in csv file

    const OutCsv1 = [];
    const OutCsv2 = [];

   //store array of object to write in csv file without weight
    for(data of csv1){
        const obj = {}
        obj['node1'] = data[0]
        obj['node2'] = data[1]
        OutCsv1.push(obj)

    }

   //store array of object to write in csv file with weight

    for(data of csv2){
        const obj = {}
        obj['node1'] = data[0]
        obj['node2'] = data[1]
        obj['weight'] = data[2]
        OutCsv2.push(obj)

    }

  //write data in csv file without weight

   const csvWriter1 = createCsvWriter({
    path: 'outOnlyRelation.csv',
    header: [
      {id: 'node1', title: 'node1'},
      {id: 'node2', title: 'node2'},
      
    ]
  });
  
  csvWriter1
    .writeRecords(OutCsv1)
    .then(()=> console.log('The CSV file was written successfully'));
  

//write data in csv file with weight

    const csvWriter2 = createCsvWriter({
        path: 'outWithWeight.csv',
        header: [
          {id: 'node1', title: 'node1'},
          {id: 'node2', title: 'node2'},
          {id: 'weight', title: 'weight'},
          
        ]
      });
      
      
      csvWriter2
        .writeRecords(OutCsv2)
        .then(()=> console.log('The CSV file was written successfully'));
      
   

    
  });
