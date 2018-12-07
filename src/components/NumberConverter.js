import React, { Component } from 'react';
import './NumberConverter.css';

class NumberConverter extends Component {

    // ==================================================================================================================
    // Constructor
    // ==================================================================================================================
    constructor(props){
        super(props);
        this.state = {
            titleText: 'NumberConverter component',
            labelText: 'Enter number',
            inputValue: '',
            resultConversion: ''
        }
        this.onChange = this.onChange.bind(this);
        this.onClickConvertButton = this.onClickConvertButton.bind(this);
    }


    // ==================================================================================================================
    // Get value from input
    // ==================================================================================================================
    onChange(event){
        this.setState({
            inputValue: event.target.value
        });
        if(event.target.value===""){
            this.setState({
                resultConversion: ''
            });
        }
    }

    // ==================================================================================================================
    // Control buttons' click event
    // ==================================================================================================================
    onClickConvertButton(event){
        let inputValue = this.state.inputValue;
        let numberToConvert = 0;
        let resultConversion = '';

        switch(event.target.id){
            case 'binToRoman':
                //Only want 1 & 0
                if(this.isBinary(inputValue)){
                    numberToConvert = parseInt(inputValue,2);
                }               
            break;
            case 'decToRoman':
                //Only want numbers
                if(this.isDecimal(inputValue)){
                    numberToConvert = parseInt(inputValue,10);
                }         
            break;
            case 'clear':
                this.setState({
                    inputValue: '',
                    resultConversion: ''
                });
            return;
            default:
                numberToConvert = 0;
            break;
        }

        if(!isNaN(numberToConvert)){
            resultConversion = this.decimalToRoman(numberToConvert);
        }

        this.setState({
            resultConversion: resultConversion
        });       
    }


    // ==================================================================================================================
    // Get roman number of decimal value
    // ==================================================================================================================
    decimalToRoman(decimal){
        if(decimal < 1){
            return 'impossible to convert';
        }       
        if(decimal < 4000){
            return this.decimalToRomanUnder4000(decimal,false);           
        }else{
            return this.decimalToRomanOver4000(decimal);
        }
    }


    // ==================================================================================================================
    // Get roman number of decimal < 4000
    // It receives a param fromAbove4000 if it is called from decimalToRomanOver4000
    // ==================================================================================================================
    decimalToRomanUnder4000(decimal,fromAbove4000){
        let romanNumber = 'impossible to convert';
        let romanCharUnits = ['','I','II','III','IV','V','VI','VII','VIII','IX'];
        let romanCharTens = ['','X','XX','XXX','XL','L','LX','LXX','LXXX','XC'];
        let romanCharHundreds = ['','C','CC','CCC','CD','D','DC','DCC','DCCC','CM'];
        let romanCharThousands = ['','M','MM','MMM'];

        let units = decimal%10;
        decimal = decimal-units;
        decimal = decimal/10;

        let tens = decimal%10;
        decimal = decimal - tens;
        decimal = decimal/10;

        let hundreds  = decimal%10;
        decimal = decimal - hundreds;
        decimal = decimal/10;

        let thousands = decimal%10;
        decimal = decimal - thousands;
        decimal = decimal/10;

        romanNumber = romanCharThousands[thousands]+romanCharHundreds[hundreds]+romanCharTens[tens]+romanCharUnits[units];

        if(!fromAbove4000){
            romanNumber =   <table className='RomanTable' align='center'>
                                <tbody>
                                    <tr><td>{romanNumber}</td></tr>
                                </tbody>
                            </table>
        }

        return romanNumber;
    }


    // ==================================================================================================================
    // Paints roman number greater than 3999
    // If number>3999 we need another method as we cannot paint the same symbol together more than 3 times
    // a line over the roman number represents it must be multiplied by 1000
    // 2 lines over *1000*1000
    // 3 lines over *1000*1000*1000
    // etc
    // For example: 
    //   to represent 4000 it is not MMMM but V (with a line over)
    //   to represent 327245 it would be CCCXXVII(with a line over)CCXLV
    // ==================================================================================================================
    decimalToRomanOver4000(decimal){
        let romanNumber = 'impossible to convert';
        let arrayThousands = [];
        let searchThousands = true;
        while (searchThousands) {
            let tmpArray = this.getThousands(decimal);
            arrayThousands.push(tmpArray[0]);
            decimal = tmpArray[1];
            if (decimal < 4000) {
                arrayThousands.push(decimal);
                searchThousands = false;
            }
        }
        arrayThousands = arrayThousands.reverse();

        // I make groups of quantities in order to put lines o ver their roman representation
        let arrayRoman = [];

        for(let i=0;i<arrayThousands.length;i++){
            arrayRoman.push(this.decimalToRomanUnder4000(arrayThousands[i],true));
        }
    
        // This is to paint the number of lines over the roman number
        // There is a better way in React to do it (using maps), but don't have time to solve it on the smart way
        let arrayLines = [
                            <div><hr></hr></div>,
                            <div><hr></hr><hr></hr></div>,
                            <div><hr></hr><hr></hr><hr></hr></div>,
                            <div><hr></hr><hr></hr><hr></hr><hr></hr></div>,
                            <div><hr></hr><hr></hr><hr></hr><hr></hr><hr></hr></div>,
                            <div><hr></hr><hr></hr><hr></hr><hr></hr><hr></hr><hr></hr></div>,
                            <div><hr></hr><hr></hr><hr></hr><hr></hr><hr></hr><hr></hr><hr></hr></div>,
                            <div><hr></hr><hr></hr><hr></hr><hr></hr><hr></hr><hr></hr><hr></hr><hr></hr></div>,
                            <div><hr></hr><hr></hr><hr></hr><hr></hr><hr></hr><hr></hr><hr></hr><hr></hr><hr></hr></div>,
                            <div><hr></hr><hr></hr><hr></hr><hr></hr><hr></hr><hr></hr><hr></hr><hr></hr><hr></hr><hr></hr></div>,
                            <div><hr></hr><hr></hr><hr></hr><hr></hr><hr></hr><hr></hr><hr></hr><hr></hr><hr></hr><hr></hr><hr></hr></div>,
                            <div><hr></hr><hr></hr><hr></hr><hr></hr><hr></hr><hr></hr><hr></hr><hr></hr><hr></hr><hr></hr><hr></hr><hr></hr></div>
                        ];
        
        // Paint a table with 2 rows, the upper row will be to paint the lines    
        let rows = [];
        for(var i=0;i<2;i++){
            let rowID = `row${i}`;
            let cell = [];
            for(var idx=0;idx<arrayRoman.length;idx++){
                let cellID = `cell${i}-${idx}`;
                if(i===1){
                    cell.push(<td key={cellID} id={cellID}>{arrayRoman[idx]}</td>);
                }else{
                    let strLine = '';
                    if(arrayThousands[idx]!=0){
                        let numLines = arrayRoman.length-(idx+1);
                        strLine = arrayLines[numLines-1];
                    } 
                    cell.push(<td className='CellRomanTable' key={cellID} id={cellID}>{strLine}</td>);
                }
            }
            rows.push(<tr key={i} id={rowID}>{cell}</tr>)
        }
        romanNumber =   <table className='RomanTable' align='center'>
                            <tbody>
                                {rows}
                            </tbody>
                        </table>

        return romanNumber; 
    }

   
    // ==================================================================================================================
    // Returns an array with the values of the number separated by thousands 
    // ==================================================================================================================
    getThousands(number) {
        let result = [];
        let thousands = number % 1000;
        result.push(thousands);
        number = number - thousands;
        number = number / 1000;
        result.push(number);
        return result;
    }

 
    // ==================================================================================================================
    // Returns true if the string passed is binary 
    // ==================================================================================================================
    isBinary(number){
        number = String(number);         
        for(let i=0; i<number.length; i++){
            if (number.charAt(i)!=='1' && number.charAt(i)!=='0'){              
               return false;
            }
         }
        return true;
    }

 
    // ==================================================================================================================
    // Returns true if the string passed is a number
    // ==================================================================================================================
    isDecimal(number){
        number = String(number);
        for(let i=0; i<number.length; i++){    
            if(isNaN(number.charAt(i)) || number.charAt(i)===' '){
                return false;
            }
        }
        return true;
    }


    // ==================================================================================================================
    // React render
    // ==================================================================================================================
    render() {
      return (
        <div className='NumberComponentContainer'>

            <div>
                {this.state.titleText}
                <br></br>
                <label>{this.state.labelText}</label>
                <input type='text' value={this.state.inputValue} onChange={this.onChange}/>
                <button id="decToRoman" onClick={this.onClickConvertButton}>Dec to Roman</button>
                <button id="binToRoman" onClick={this.onClickConvertButton}>Bin to Roman</button>
                <button id="clear" onClick={this.onClickConvertButton}>Clear</button>
            </div>
        
            <div>
                input value: {this.state.inputValue}
                <br></br><br></br>
                {this.state.resultConversion}
                <br></br><br></br>
            </div>
            
        </div>
      );
    }
  }
  
  export default NumberConverter;
  