import { Component, OnInit, ViewChild } from '@angular/core';
import { HotTableRegisterer } from '@handsontable/angular';
import Handsontable from 'handsontable';
import { HyperFormula } from 'hyperformula';
import { Data } from './data';
import { InteractionsService } from './services/interactions.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  constructor(private interactionsService: InteractionsService){}

  tables = false; 
  data = new Data(); 
  loadingGeneral = true; 
  readOnly = true; 
  roles = ["ROLE_CONTROLLER_PYC"]
  actualFoto : any = {}

  /**
   * VARIABLES 
   */
   commentsList ={
    tabla1 : [],
    tabla2 : []
  };
   hotRegisterer = new HotTableRegisterer();
   
   //To define columns' widths
   inicialWidths: number[] =[]
 
   table1Existe = false; 
   table2Existe = false; 
   //TABLE 1
   @ViewChild('T1') t1 : HTMLDivElement; 
   columnNames: string[] = [];
   columnsToMap: string[] = [];
   tableData;
   loadingTabla1: boolean = false; 
   notFound1: boolean = false; 
   tableId1: string ="tabla1"
   table1Ready1: boolean = false; 
   commentList1: any[] = [];
   limitOfHeaders: number = 0;
 
 
   //TABLE 2
   @ViewChild('T2') t2 : HTMLDivElement; 
   columnNames2: string[] = [];
   columnsToMap2: string[] = [];
   commentList2: any[] = [];
   tableData2;
   loadingTabla2: boolean = false; 
   notFound2: boolean = false; 
   tableId2: string ="tabla2"
   table1Ready2: boolean = false; 
 
   //TABLE 3
   @ViewChild('T3') t3 : HTMLDivElement; 
   columnNames3: string[] = []; 
   tableId3: string = "tabla3";
   tablaData3 = [];
   table3Ready = false; 
   table3Loading = false; 
   table1Ready3: boolean = false; 
 
   // TABLE 4
   @ViewChild('T4') t4: HTMLDivElement;
   columnNames4: string[] = [];
   columnsToMap4: string[] = [];
   tableId4: string = "tabla4";
   tablaData4 = [];
   table4Ready = false; 
   table4Loading = false; 
   table1Ready4: boolean = false; 
 
    // TABLE 5
    @ViewChild('T5') t5: HTMLDivElement;
    columnNames5: string[] = [];
    columnsToMap5: string[] = [];
    tableId5: string = "tabla4";
    tablaData5 = [];
    table5Ready = false; 
    table5Loading = false; 
    table1Ready5: boolean = false; 
 

  
  ngOnInit(): void {
    this.actualFoto.mesFoto = "202108"
    this.generateTables(); 

    this.interactionsService.crearTabla4.subscribe(response => {
      if(response){
        this.getHandsontable4(); 
      }
    })
    this.interactionsService.crearTablas34y5.subscribe(response => {
      if(response){
        console.log("TABLES 1 AND 2 READY"); 
        this.getHandsontable4(); 
        this.getHandsontable5(); 
        this.getHandsontable3(); 
      }
    })

    this.interactionsService.sincronizarTablas.subscribe(response => {
      if(response){
        console.log("TABLES WILL BE SYNC"); 
        this.sincronizarTablas()
      }
    })

  }
  

  generateTables(){
    this.tables = true; 
    this.loadingGeneral = true; 
    this.getHandsontable1(); 
    this.loadingGeneral = false; 
    this.getHandsontable2(); 

    this.interactionsService.check1and2True(); 
    this.interactionsService.checkAllTrue(); 
  }
  //HANDSONTABLE 1
  getHandsontable1(){
    this.loadingTabla1 = true; 
    
    let { comments, handsontable } = this.data.dataTable1; 
    let { colHeaders, columns, genericData } = handsontable;
      
    this.columnNames = colHeaders; 
    this.columnsToMap = columns; 
    this.tableData = genericData; 
  
    this.loadingTabla1 = false; 
    this.table1Existe = true; 

  }
  
  //HANDSONTABLE 2
  getHandsontable2(){
    this.loadingTabla2 = true; 
    let { comments, handsontable } = this.data.dataTable2; 
    let { colHeaders, columns, genericData } = handsontable;
      
    this.columnNames2 = colHeaders; 
    this.columnsToMap2 = columns; 
    this.tableData2 = genericData; 

    this.loadingTabla2 = false; 
    this.table2Existe = true; 
  }

  //HANDSONTABLE 3
  /**
   * Handsontable 3 consist in subtract some cells in handsontable 1 to handsontable 2
   */
  getHandsontable3(){

    this.table3Loading = true; 
    this.columnNames3 = this.generateMiddleTableColumnNames();

    let result = []
    let rowIndex = 0; 

    for(let row of this.tableData){
      let newRow = {}
      for(let key in row){

        if(key == "control"){
          newRow[key] = this.tableData[rowIndex][key]
        } else{
          //If table 2 doesn't contain the key, value = 0
          if(!this.columnsToMap2.includes(key)){
            newRow[key] = "0.00"
            continue; 
          } 
          //Si si la incluye se hace la resta
          else {
            //If is a number, substract
            newRow[key] = Number(this.tableData2[rowIndex][key]) - Number(this.tableData[rowIndex][key])

            //If is a formula, value = formula
            if( newRow[key].toString() == "NaN"){
              newRow[key] = this.tableData[rowIndex][key]; 
            }
          }
        }
      }
      result.push(newRow)
      rowIndex ++;
    }
    this.tablaData3 = result; 
    this.table3Loading = false; 
    this.table3Ready = true; 
  }
  
  getHandsontable4(){
    this.tablaData4 = []
    this.columnNames4 = [...this.columnNames];
    this.columnsToMap4 = [...this.columnsToMap];
    this.columnNames4[0] = "Indicador";

    let CPT_medio: Data = new Data();
    let AC: Data = new Data();
    let EV: Data = new Data();
    let PV: Data = new Data();
    let CPI: Data = new Data();
    let SPI: Data = new Data();

    CPT_medio['control'] = 'CPT_medio';
    AC['control'] = 'AC';
    EV['control'] = 'EV';
    PV['control'] = 'PV';
    CPI['control'] = 'CPI';
    SPI['control'] = 'SPI';


    let allDataTable = this.hotRegisterer.getInstance(this.tableId1).getData();

    for(let i = 0; i < allDataTable.length; i++){
      if(i != 2) continue;
      for(let j = 1; j < allDataTable[1].length; j++){
        //  se valida que sea la columna ""
        if(j == 6){
          CPT_medio[this.columnsToMap4[j]] = "0";
          //AC[this.columnsToMap4[j]] = "0"
        }else{
          if(Number(allDataTable[i][j]) == 0 || Number(allDataTable[i-1][j]) == 0){
            CPT_medio[this.columnsToMap4[j]] = ("0")  
          }else{
            CPT_medio[this.columnsToMap4[j]] = (Number(allDataTable[i][j]) / Number(allDataTable[i-1][j])).toString();
          }
          //AC[this.columnsToMap4[j]]= (Number(allDataTable[i][j]) + Number(allDataTable[i+1][j]) + Number(allDataTable[i+2][j])).toString();
        }
      }
    }
    this.tablaData4.push(CPT_medio, AC, EV, PV, CPI, SPI);
    this.table4Loading = false;
  }

  getHandsontable5(){
    this.tablaData5 = []
    this.columnNames5 = [...this.columnNames2];
    this.columnsToMap5 = [...this.columnsToMap2];
    this.columnNames5[0] = "Indicador";

    let CPT_medio: Data = new Data();
    let AC: Data = new Data();
    let EV: Data = new Data();
    let PV: Data = new Data();
    let CPI: Data = new Data();
    let SPI: Data = new Data();

    CPT_medio['control'] = 'CPT_medio';
    AC['control'] = 'AC';
    EV['control'] = 'EV';
    PV['control'] = 'PV';
    CPI['control'] = 'CPI';
    SPI['control'] = 'SPI';


    let allDataTable = this.hotRegisterer.getInstance(this.tableId2).getData();

    for(let i = 0; i < allDataTable.length; i++){
      if(i != 2) continue;
      for(let j = 1; j < allDataTable[1].length; j++){
        //  se valida que sea la columna ""
        if(j == 6){
          CPT_medio[this.columnsToMap5[j]] = "0";
          //AC[this.columnsToMap5[j]] = "0"
        }else{
          if(Number(allDataTable[i][j]) == 0 || Number(allDataTable[i-1][j]) == 0){
            CPT_medio[this.columnsToMap5[j]] = ("0")  
          }else{
            CPT_medio[this.columnsToMap5[j]] = (Number(allDataTable[i][j]) / Number(allDataTable[i-1][j])).toString();
          }
          //AC[this.columnsToMap5[j]]= (Number(allDataTable[i][j]) + Number(allDataTable[i+1][j]) + Number(allDataTable[i+2][j])).toString();
        }
      }
    }

    this.tablaData5.push(CPT_medio, AC, EV, PV, CPI, SPI);
    this.table5Loading = false;
  }

  generateMiddleTableColumnNames(){
    let columnName: string[] = [...this.columnNames];
    
    let columnNameToReturn: string[] = [];
    let limit =  columnName.length;
    for(let i=0; i < limit; i++){

      if(6 < i && i < limit-2){
        
        if(columnName[i].search('Real') != -1){
          columnNameToReturn.push(columnName[i].replace("Real", "Dif"));  
        }else{
          columnNameToReturn.push(`Dif ${columnName[i].replace("Prev", "")}`);
        }

      }else{
        columnNameToReturn.push(columnName[i]);
      }
    }
    return columnNameToReturn;
  }

  isReadOnly(title: string, tableId: string){

    /**
     * Only we can edit table 1 if we are in edit mode
     */
     if (tableId == "tabla2") {
      return true;
    }

    /**
     * Col last "real" month is editable in row 5
     */
     let colMesFoto = this.columnNames.findIndex(mes => mes.includes(this.actualFoto.mesFoto));
    if(!this.readOnly){
      
      this.hotRegisterer.getInstance(this.tableId1).setCellMeta(5, colMesFoto, 'readOnly', false);

      /**
       * Allow to edit row 0 if has role "director" or "controller" from last "real"
       */   
      let nombreColumna = this.columnsToMap[this.columnNames.indexOf(title)]; 
      let readOnly = !this.roles.includes("ROLE_DIRECTOR_PYC") && !this.roles.includes("ROLE_CONTROLLER_PYC")
      if(this.columnsToMap.indexOf(nombreColumna) >= 6 +  Number(this.actualFoto.mesFoto.substring(4, 6))){
        this.hotRegisterer.getInstance(this.tableId1).setCellMeta(0, this.columnsToMap.indexOf(nombreColumna), "readOnly", readOnly); 
      }

    } 
    else {
      /**
       * When readOnly = true, can't edit Col last "real" month in row 5
       */
        try{
          this.hotRegisterer.getInstance(this.tableId1).setCellMeta(5, colMesFoto, 'readOnly', true); 
        } catch(e){}
    }

    /**
     * This columns are not editable
     */
    if (title.search("Presupuesto") != -1 || title.search("Ejecutado") != -1 ||
        title.search("Real") != -1 || title.search("Control") != -1 || this.readOnly || 
        title.search("cierre") != -1 || title.search("Prevision") != -1 || title.search("Pto") != -1 ) {
      return true;
    } else {
      return false;
    }
  }


  editTable(value: boolean){
    this.readOnly = !value;
    this.setComents(this.tableId1);
  }
  /**
   * Función para añadir comentarios a una tabla 
   */

   setComents(tableId: string){
    setTimeout(() => {
      let commentsPlugin = this.hotRegisterer.getInstance(tableId).getPlugin('comments')
      this.commentsList[tableId].forEach(comment=>{
        commentsPlugin.setCommentAtCell(comment.row , comment.col, comment.value); 
      })
    }, 1000)
  }

  /**
   * To sync scrolls
   **/

    getScrollPositions(elements: HTMLDivElement[]) {
    return elements.map((el) => ({ scrollLeft: el.scrollLeft, scrollTop: el.scrollTop }));
  }

  syncScroll(elements: HTMLDivElement[]) {
    let scrollPositions = this.getScrollPositions(elements);
    elements.forEach((el) => el.addEventListener('scroll', () => {
      let currentPositions = this.getScrollPositions(elements);
      for (let [i, position] of currentPositions.entries()) {
        for (let dim of ['scrollLeft', 'scrollTop']) {
          if (position[dim] != scrollPositions[i][dim]) {
            for (let element of elements) {
              element[dim] = position[dim];
            }
          }
        }
      }

      scrollPositions = currentPositions;
    }));
  }

  sincronizarTablas() {
    
    let table1 = this.t1['container']['nativeElement']['children'][0]['children'][0]
    let table2 = this.t2['container']['nativeElement']['children'][0]['children'][0]
    let table3 = this.t3['container']['nativeElement']['children'][0]['children'][0]
    let table4 = this.t4['container']['nativeElement']['children'][0]['children'][0]
    let table5 = this.t5['container']['nativeElement']['children'][0]['children'][0]
    this.syncScroll([table1, table2, table3, table4, table5])
    
    }
  /**
   * hotSettings functions
   */
   colHeadersColor(col, TH, columnNames){
    if (col == 0 || col == 1 || col == 2 || col == 6) {
      TH.style.backgroundColor = "#44546A";
      TH.style.color = "#ffff";
    }
    else if (col == 3) {
      TH.style.backgroundColor = "#92D050";
    }
    else if (TH.textContent.search("Real") != -1) {
      TH.style.backgroundColor = "#00B050";
    }
    else if (TH.textContent.search("Prevision") != -1 || col == 5 || col > columnNames.length - 3) {
      TH.style.backgroundColor = "#FFFF00";
    }
    else if (TH.textContent.search("Prev ") != -1 && col < 19) {
      TH.style.backgroundColor = "#FFF2CC";
    }
    else if(col >= 19){
      TH.style.backgroundColor = "#FFDFCC";
    }
  }

  afterChangeTable1(changes) {
    try {

      changes.forEach((changes, src) => {
        
        let row = changes[0]
        let col = changes[1]
        let oldValue = changes[2]; 
        let newValue = changes[3]

        /**
         * Asigna el valor real de la celda en formato número 
         */
        if (newValue.includes(",")) {
          let indexCol = this.columnsToMap.indexOf(col.toString());
          let value = Number(newValue.toString().replace(".", "").replace(",", ".")).toFixed(2)
          this.hotRegisterer.getInstance(this.tableId1).setDataAtCell(row, indexCol, value);
        }
        if (!newValue) {
          let indexCol = this.columnsToMap.indexOf(col.toString());
          this.hotRegisterer.getInstance(this.tableId1).setDataAtCell(row, indexCol, "0.00");
        }

        let indexCol = this.columnsToMap.indexOf(col.toString());
        if(oldValue != newValue){
          this.hotRegisterer.getInstance(this.tableId1).setCellMeta(row, indexCol, 'className', 'isDirty');
          this.hotRegisterer.getInstance(this.tableId1).render(); 
        }

        this.getHandsontable3(); 
        this.getHandsontable4();
      });
    } catch (error) {
      console.error();
    }
  }
  /**-------------------------------------------------------------------------------------------
   * ----------------------------------------HOTSETTINGS----------------------------------------
     -------------------------------------------------------------------------------------------*/
  hotSettings1: Handsontable.GridSettings = {
    licenseKey: 'non-commercial-and-evaluation',
    //Para asignar colores a los headers 
    afterGetColHeader: (col, TH) => {
      this.colHeadersColor(col, TH, this.columnNames)
    },
    //AFTERCHANGE Se activa cuando se realiza algún cambio a cualquier celda
    afterChange: (changes) => {
      this.afterChangeTable1(changes); 

    }, 
    fixedColumnsLeft: 7, 
    comments: true, 
    formulas: {
      engine: HyperFormula
    }, 
    contextMenu: {items:{
      "Añadir Comentario":{
        name: 'Añadir Comentario',
        callback:(key, options) =>{
          let col = options[0].end.col;
          let row = options[0].end.row;
          this.hotRegisterer.getInstance(this.tableId1).getPlugin('comments').showAtCell(row, col);   
        },
        hidden: ()=>{
          // Se obtiene la fila y la columna que ha sido clickeada. (indice de estas)
          let row = this.hotRegisterer.getInstance(this.tableId1).getSelectedLast()[0];
          let col = this.hotRegisterer.getInstance(this.tableId1).getSelectedLast()[1];
          let listOfNumber: number[] = [];

          for(let i=0; i<this.limitOfHeaders; i++){
            listOfNumber.push(i);
          }
          let colMesFoto = this.columnNames.findIndex(mes => mes.includes(this.actualFoto.mesFoto));
          if( col === colMesFoto && !this.readOnly && (row === 5 )){
            return false;
          }

          if(this.roles.includes('ROLE_ADMIN') || 
          this.roles.includes('ROLE_CONTROLLER_PYC') || this.roles.includes('ROLE_DIRECTOR_PYC')){
            if( col === colMesFoto && !this.readOnly && (row === 0 )){
              return false;
            }
          }
          if(listOfNumber.includes(col)||[0,8,7,5].includes(row) || this.readOnly){
            return true;
          }
          else{
            return false
          }
        }
      }
    }},cells(row, column) {
      
      if (column != 0 && row != 8) {
        return {
          renderer(instance, td, row, col, prop, value, cellProperties) {
            Handsontable.renderers.TextRenderer.apply(this, arguments)
      
            if(td.className == "isDirty"){
              td.style.background = "#E2D6F3"
            }
            try {
              /**
               * Se convierte al formato de número para que las fórmulas 
               * funcionen
               */
              td.className = "htRight"
              value = Number(value.toString().replace(",", ".")).toFixed(2)
              td.textContent = value.toString().replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
              if (row == 0) {
                td.style.backgroundColor = "#E2F6DA";
              }
              if (row == 7) {
                cellProperties.readOnly = true
                td.style.backgroundColor = "#FFE699"
                if (col == instance.countSourceCols() - 1 && value > 0) {
                  td.style.color = '#C74687'
                }
              }
              if (col == instance.countSourceCols() - 1 && row != 7) {
                if (value < 0) {
                  td.style.color = 'red'
                }
              }
            } catch (error) {
              console.log(error)
            }
          }
        }
      }
      else if (row == 8) {
        return {
          renderer(instance, td, row, col, prop, value, cellProperties) {
            Handsontable.renderers.TextRenderer.apply(this, arguments)
            if (col != 0) {
              td.className = "htRight"
            }

            if (col == 0) {
              td.style.backgroundColor = "#E2EFDA";
            } else {
              td.style.backgroundColor = "#FFE699";
            }

            if (col != 0) {
              if (td.textContent == "#VALUE!") {
                td.innerHTML = "0%";
                cellProperties.readOnly = true;
              }
              else {
                td.textContent = Number(td.textContent).toFixed(2) + "%";
              }
            }
            if (col == instance.countSourceCols() - 1 && value > 0) {
              td.style.color = '#C74687'
            }
            cellProperties.readOnly = true;
          }
        }
      }
      else {
        return {
          renderer(instance, td, row, col, prop, value, cellProperties) {
            Handsontable.renderers.TextRenderer.apply(this, arguments)

            if (col == 0) {
              td.style.backgroundColor = "#E2EFDA";
            } else {
              td.style.backgroundColor = "#FFE699";
              cellProperties.readOnly = true;
            }
          }
        }
      }
    }, 
    afterInit: () => {
      this.setComents(this.tableId1); 
      this.getHandsontable4(); 

      for(let i = 0; i < this.columnsToMap.length; i ++){
        this.inicialWidths.push(this.hotRegisterer.getInstance(this.tableId1).getColWidth(i))
      }   

      this.interactionsService.sett1(true); 
      this.interactionsService.setT1Aux(true); 
      this.interactionsService.setT1Aux2(true);
    }
  }

  hotSettings2: Handsontable.GridSettings = {
    readOnly: true,
    fixedColumnsLeft: 7,
    comments: true, 
    formulas: {
      engine: HyperFormula
    }, 
    //Para asignar colores a los headers 
    afterGetColHeader: (col, TH) => {
      this.colHeadersColor(col, TH, this.columnNames2)
    },
    cells(row, column) {
      
      if (column != 0 && row != 8) {
        return {
          renderer(instance, td, row, col, prop, value, cellProperties) {
            Handsontable.renderers.TextRenderer.apply(this, arguments)
            if(td.className == "isDirty"){
              td.style.background = "#E2D6F3"
            }
            try {
              /**
               * Se convierte al formato de número para que las fórmulas 
               * funcionen
               */
              td.className = "htRight"
              value = Number(value.toString().replace(",", ".")).toFixed(2)
              td.textContent = value.toString().replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
              if (row == 0) {
                td.style.backgroundColor = "#E2F6DA";
              }
              if (row == 7) {
                cellProperties.readOnly = true
                td.style.backgroundColor = "#FFE699"
                if (col == instance.countSourceCols() - 1 && value > 0) {
                  td.style.color = '#C74687'
                }
              }
            } catch (error) {
            }
          }
        }
      }
      else if (row == 8) {
        return {
          renderer(instance, td, row, col, prop, value, cellProperties) {
            Handsontable.renderers.TextRenderer.apply(this, arguments)
            if (col != 0) {
              td.className = "htRight"
            }

            if (col == 0) {
              td.style.backgroundColor = "#E2EFDA";
            } else {
              td.style.backgroundColor = "#FFE699";
            }

            if (col != 0) {
              if (td.textContent == "#VALUE!") {
                td.innerHTML = "0%";
              }
              else {
                td.textContent = Number(td.textContent).toFixed(2) + "%";
              }
            }
            if (col == instance.countSourceCols() - 1 && value > 0) {
              td.style.color = '#C74687'
            }
          }
        }
      }
      else {
        return {
          renderer(instance, td, row, col, prop, value, cellProperties) {
            Handsontable.renderers.TextRenderer.apply(this, arguments)

            if (col == 0) {
              td.style.backgroundColor = "#E2EFDA";
            } else {
              td.style.backgroundColor = "#FFE699";
            }
          }
        }
      }
    }, 
    afterInit: () => {
      this.setComents(this.tableId2); 
      this.getHandsontable5(); 
      this.interactionsService.sett2(true)
      this.interactionsService.setT2Aux(true)
    }
  }

  hotSettings3: Handsontable.GridSettings = {
    readOnly: true,
    formulas: {
      engine: HyperFormula
    },
    manualColumnResize: this.inicialWidths,
    fixedColumnsLeft: 7,
    licenseKey: 'non-commercial-and-evaluation',
    cells(row, column) {
      if (column != 0 && row != 8) {
        return {
          renderer(instance, td, row, col, prop, value, cellProperties) {
            Handsontable.renderers.TextRenderer.apply(this, arguments)
            try {

              td.className = "htRight"
              value = Number(value.toString().replace(",", ".")).toFixed(2)
              td.textContent = value.toString().replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".");

              /**
               * Lineas 1, 6, 7, 8 y 9 son rojos si es positivo. Porque  son cobros/ingresos
               */
              if(row == 0 || row == 5 || row == 6 || row == 7){
                if(value > 0){
                  td.style.color = 'red'
                  td.style.backgroundColor = '#E5E7E9 '
                }
              }
              /**
               * Otras lineas serán rojas si el valor es menor a 0 
               */
              else {
                if(value < 0){
                  td.style.color = 'red'
                }
              }
            } catch (error) {
            }
          }
        }
      }
      else if (row == 8) {
        return {
          renderer(instance, td, row, col, prop, value, cellProperties) {
            Handsontable.renderers.TextRenderer.apply(this, arguments)
            if(value > 0){
              td.style.color = 'red'
              td.style.backgroundColor = '#E5E7E9 '
            }
            if (col != 0) {
              td.className = "htRight"
            }
            if(col == 0){
              td.style.backgroundColor = "#E2EFDA";
            }
            if (col != 0) {
              if (td.textContent == "#VALUE!") {
                td.innerHTML = "0%";
                cellProperties.readOnly = true;
              }
              else {
                td.textContent = Number(td.textContent).toFixed(2) + "%";
              }
            }
          }
        }
      }
      else {
        return {
          renderer(instance, td, row, col, prop, value, cellProperties) {
            Handsontable.renderers.TextRenderer.apply(this, arguments)

            if (col == 0) {
              td.style.backgroundColor = "#E2EFDA";
            } 
          }
        }
      }
    },
    afterInit : () => {
      this.interactionsService.sett3(true)
    } 
  }

  hotSettings4: Handsontable.GridSettings = {
    formulas: {
      engine: HyperFormula
    },
    licenseKey: 'non-commercial-and-evaluation',
    fixedColumnsLeft: 7,
    readOnly: true,
    // manualColumnResize: [124], //Se le asignan 122 px a la primera col (124 = 122px)
    manualColumnResize: this.inicialWidths,
    afterGetColHeader: (col, TH) => {
      this.colHeadersColor(col, TH, this.columnNames4)
    },
    //AFTERCHANGE.Se activa cuando se realiza algún cambio a cualquier celda
    cells(row, column) {
      if(column == 0){
        return {
          renderer(instance, td, row, col, prop, value, cellProperties){
            Handsontable.renderers.TextRenderer.apply(this, arguments)
            td.style.background = "#E2EFDA";
          }
        }
      }
      if (column != 0) {
        return {
          renderer(instance, td, row, col, prop, value, cellProperties) {
            Handsontable.renderers.TextRenderer.apply(this, arguments)
            try {
              /**
               * Se convierte al formato de número para que las fórmulas 
               * funcionen
               */
              td.className = "htRight"
              value = Number(value.toString().replace(",", ".")).toFixed(2)
              td.textContent = value.toString().replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            
            } catch (error) {
              // console.log(error)
            }
          }
        }
      }
    },
    afterInit : () => {
      this.interactionsService.sett4(true)
    } 
  }

  hotSettings5:  Handsontable.GridSettings = {
    formulas: {
      engine: HyperFormula
    },
    licenseKey: 'non-commercial-and-evaluation',
    fixedColumnsLeft: 7,
    readOnly: true,
    // manualColumnResize: [124], //Se le asignan 122 px a la primera col (124 = 122px)
    manualColumnResize: this.inicialWidths,
    afterGetColHeader: (col, TH) => {
      this.colHeadersColor(col, TH, this.columnNames5)
    },
    //AFTERCHANGE.Se activa cuando se realiza algún cambio a cualquier celda
    cells(row, column) {
      if(column == 0){
        return {
          renderer(instance, td, row, col, prop, value, cellProperties){
            Handsontable.renderers.TextRenderer.apply(this, arguments)
            td.style.background = "#E2EFDA";
          }
        }
      }
      if (column != 0) {
        return {
          renderer(instance, td, row, col, prop, value, cellProperties) {
            Handsontable.renderers.TextRenderer.apply(this, arguments)
            try {
              /**
               * Se convierte al formato de número para que las fórmulas 
               * funcionen
               */
              td.className = "htRight"
              value = Number(value.toString().replace(",", ".")).toFixed(2)
              td.textContent = value.toString().replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            
            } catch (error) {
              // console.log(error)
            }
          }
        }
      }
    },
    afterInit : () => {
      this.interactionsService.sett5(true)
    } 
  }
}
