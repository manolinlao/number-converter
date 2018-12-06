import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './NumberConverter.css';


class NumberConverter extends Component {
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

    onChange(event){
        this.setState({
            inputValue: event.target.value
        });
    }

    onClickConvertButton(event){
        if(event.target.id=="decToRoman"){

            //convert fron decimal to roman
            let inputValue = this.state.inputValue;
            inputValue = this.decimalToRoman(inputValue);
            
            this.setState({
                resultConversion: inputValue
            });
        }
    }


    /*
    * TO_DO: For numbers larger thab 3999 must follow another convention. 
    */
    decimalToRoman(decimal){
        if(decimal<=0){
            return 'number too small';
        }
        if(decimal>3999){
            return 'number too big';
        }

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

        let romanNumnber = romanCharThousands[thousands]+romanCharHundreds[hundreds]+romanCharTens[tens]+romanCharUnits[units];

        return romanNumnber;

    }


    render() {
      return (
        <div className='NumberComponentContainer'>

            <div>
                {this.state.titleText}
                <br></br>
                <label>{this.state.labelText}</label>
                <input type='text' value={this.state.inputValue} onChange={this.onChange}/>
                <button id="decToRoman" onClick={this.onClickConvertButton}>Dec to Roman</button>
            </div>
        
            <div>
                input value: {this.state.inputValue}
                <br></br>
                Result of conversion: {this.state.resultConversion}
            </div>

        </div>
      );
    }
  }
  
  export default NumberConverter;
  