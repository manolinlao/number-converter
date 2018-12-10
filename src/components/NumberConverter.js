import React, { Component } from 'react';
import propTypes from 'prop-types';
import './NumberConverter.css';

 

class NumberConverter extends Component {

    // ==================================================================================================================
    // Constructor
    // ==================================================================================================================
    constructor(props){
        super(props);
        this.state = {
            inputValue: '',
            resultConversion: '',
            activeState:'DecToRoman',
            activeStateText: 'Dec to Roman',
            clearButtonText: 'clear',
            convertButtonText: 'CONVERT',
            TEXT_MESSAGE_NOK_CONVERT: 'Impossible to convert',
            TEXT_DEC_TO_ROMAN : 'Dec to Roman',
            TEXT_BIN_TO_ROMAN : 'Bin to Roman'
        }
        this.onChange = this.onChange.bind(this);
        this.onClickConvertButton = this.onClickConvertButton.bind(this);
        this.onClickToggleButton = this.onClickToggleButton.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
    }


    // ==================================================================================================================
    // To get focus once the component is mounted
    // ==================================================================================================================
    componentDidMount(){
        this.formInput.focus();
    }

 
    // ==================================================================================================================
    // Get value from input
    // ==================================================================================================================
    onChange(event){
        this.setState({
            resultConversion: ''
        });

        this.setState({
            inputValue: event.target.value
        });       
    }

 
    // ==================================================================================================================
    // Control of key presses
    // If press Enter, make conversion
    // ==================================================================================================================
    onKeyPress(event){
        let keyPressed = event.key;
        if(keyPressed==='Enter'){
            event.target.id = this.state.activeState;
            this.onClickConvertButton(event);
        }
    }

 
    // ==================================================================================================================
    // Control Toggle button
    // ==================================================================================================================
    onClickToggleButton(event){
        if(this.state.activeState === 'DecToRoman'){
            this.setState({
                activeState: 'BinToRoman',
                activeStateText: this.state.TEXT_BIN_TO_ROMAN
            });
        }else{
            this.setState({
                activeState: 'DecToRoman',
                activeStateText: this.state.TEXT_DEC_TO_ROMAN
            });
        }
        this.formInput.focus();
    }


    // ==================================================================================================================
    // Control buttons' click event
    // we read the id of the buttn, this will be the mode
    // mode can have these values: 'BinToRoman','DecToRoman','clear'
    // ==================================================================================================================
    onClickConvertButton(event){
        let mode = event.target.id;
        let inputValue = this.state.inputValue;
        let numberToConvert = 0;
        let jsxToDraw = '';

        console.log('onClickConvertButton::mode = ' + mode);
 
        switch(mode){
            case 'BinToRoman':
                //Only want 1 & 0
                if(this.isBinary(inputValue)){
                    numberToConvert = parseInt(inputValue,2);
                }              
            break;
            case 'DecToRoman':
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
                this.formInput.focus();
                return;
            default:
                numberToConvert = 0;
            break;
        }

      
        if(!isNaN(numberToConvert)){
            console.log('onClickConvertButton::numberToConvert = ' + numberToConvert);
            if(numberToConvert > 0){               
                let arrayConvertedNumber = this.decimalToRoman(numberToConvert);
                jsxToDraw  = this.getRomanDraw(arrayConvertedNumber);          
            }else{
                jsxToDraw = this.state.TEXT_MESSAGE_NOK_CONVERT;
            }
        }

        this.formInput.focus();

        this.setState({
            resultConversion: jsxToDraw
        });      
    }


    // ==================================================================================================================
    // Get roman number of decimal value
    // Returns array with the result in roman
    // In Roman you cannot paint the same symbol more than 3 times together, so this system it is used:
    //      a line over the roman number means it must be multiplied *1000
    //      2 lines over --> the number must be multiplied *1000*1000
    //      3 lines over --> the number must be multiplied *1000*1000*1000
    //      etc
    //      For example:
    //          to write 4000, it is not MMMM but V (with a line over)
    //          to write 327245, it is CCCXXVII(with 1 line over)CCXLV
    //          to write 4324324, it IV(with 2 lines over)CCCXXIV(with 1 line over)CCCXXIV
    //
    //  To do so we use an array with these values separated, in order to make later the drawing of the overlines
    // ==================================================================================================================
    decimalToRoman(decimal){
        console.log('decimalToRoman::' + decimal);
        let result = [];
      
        if(decimal < 4000){
            result.push(this.decimalToRomanUnder4000(decimal));
        }else{
            result = this.decimalToRomanOver4000(decimal);
        }
 
        return result;
    }


    // ==================================================================================================================
    // Get roman number of decimal < 4000
    // ==================================================================================================================
    decimalToRomanUnder4000(decimal){       
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

        let romanNumber = romanCharThousands[thousands]+romanCharHundreds[hundreds]+romanCharTens[tens]+romanCharUnits[units];
        console.log('decimalToRomanUnder4000::romanNumber = ' + romanNumber);

        return romanNumber;
    }


    // ==================================================================================================================
    // Return the array with the results of the conversion   
    // ==================================================================================================================
    decimalToRomanOver4000(decimal){
        // I make groups of quantities in order to put lines o ver their roman representation
        console.log('decimalToRomanOver4000:: creating array with thousands multipliers');
        let arrayRomanMultipliers = [];
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
 
        for(let i=0;i<arrayThousands.length;i++){
            arrayRomanMultipliers.push(this.decimalToRomanUnder4000(arrayThousands[i]));
        }

        console.log('decimalToRomanOver4000:: result = ' + arrayRomanMultipliers);

        return arrayRomanMultipliers;
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
    // Return the jsx for drawing the number
    // ==================================================================================================================
    getRomanDraw(arrayRoman){
        // This is to draw the number of lines over the roman number
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

       
        // Draw a table with 2 rows, the upper row will be to draw the lines   
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
                    if(arrayRoman[idx]!==0){
                        let numLines = arrayRoman.length-(idx+1);
                        strLine = arrayLines[numLines-1];                       
                    }
                    cell.push(<td className='CellRomanTable' key={cellID} id={cellID}>{strLine}</td>);
                }
            }
            rows.push(<tr key={i} id={rowID}>{cell}</tr>)
        }

        let romanNumberDrawed = <table className='RomanTable' align='center'>
                                    <tbody>
                                        {rows}
                                    </tbody>
                                </table>
 
        return romanNumberDrawed;
    }
 

    // ==================================================================================================================
    // React render
    // ==================================================================================================================
    render() {
      return (
        <div className='NumberComponentContainer'>
 
            <div className='ConvertTitle'>
                {this.props.title}
            </div>
 
            <div className='ConvertForm'>
                <div className = 'InputContainer'>
                    <input ref={(input) => { this.formInput = input; }}  type='text' value={this.state.inputValue} onChange={this.onChange} onKeyPress={this.onKeyPress} className='InputForm'/>
                    <button id='clear' onClick={this.onClickConvertButton} className='ClearButton'>{this.state.clearButtonText}</button>
                </div>
                <br></br>
                <button id={this.state.activeState} onClick={this.onClickToggleButton} className='ToggleButton'>{this.state.activeStateText}</button>
                <button id={this.state.activeState} onClick={this.onClickConvertButton} className='ConvertButton'>{this.state.convertButtonText}</button>
            </div>
       
            <div className='ConvertResult'>
                {this.state.resultConversion}
            </div>
               
        </div>
      );
    }
}

  NumberConverter.propTypes = {
      title: propTypes.string
  }

 

export default NumberConverter;

