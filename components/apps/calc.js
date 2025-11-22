import React, { Component } from 'react'
import $ from 'jquery';
import CLI from '../base/cli';
const Parser = require('expr-eval').Parser;

const parser = new Parser({
    operators: {
      // These default to true, but are included to be explicit
      add: true,
      concatenate: true,
      conditional: true,
      divide: true,
      factorial: true,
      multiply: true,
      power: true,
      remainder: true,
      subtract: true,

      // Disable and, or, not, <, ==, !=, etc.
      logical: false,
      comparison: false,

      // Disable 'in' and = operators
      'in': false,
      assignment: true
    }
  });

export class Calc extends CLI {
    constructor(props) {
        super(props);
        this.appId = 'calc';
        this.variables={}
        // Merge state
        this.state = {
            ...this.state,
        }
    }

    componentDidMount() {
        super.componentDidMount();
        this.reStartTerminal();
    }

    getIntroLines = () => ([
        <div key="intro-1" className="text-ubt-grey">C-style arbitary precision calculator (version 2.12.7.2)</div>,
        <div key="intro-2" className="text-ubt-grey">Calc is open software.</div>,
        <div key="intro-3" className="text-ubt-grey mb-1">[ type "exit" to exit, "clear" to clear, "help" for help. ]</div>,
    ]);

    reStartTerminal = () => {
        this.setState({ 
            outputList: this.getIntroLines(),
            userInput: '',
            cursorPos: 0,
            commandHistory: [],
            historyIndex: -1,
            variables: {}
        });
    }

    closeTerminal = () => {
        $("#close-calc").trigger('click');
    }

    executeCommand = async (command) => {
        const commandRow = (
            <div className="flex w-full h-5" key={`cmd-${Date.now()}`}>
                 <div className=" flex text-ubt-green h-1 mr-2"> {';'} </div>
                 <div className="text-white whitespace-pre font-normal">{command}</div>
            </div>
        );
        
        let result = "";
        let words = command.split(' ').filter(Boolean);
        let main = words[0];
        
        if (main === "clear") {
            this.reStartTerminal();
            return;
        } else if (main === "exit") {
            this.closeTerminal();
            return;
        } else if (main === "help") {
             result = "Available Commands: <br/>Operators:<br/> addition ( + ), subtraction ( - ),<br/>multiplication ( * ), division ( / ),<br/>modulo ( % )exponentiation. ( ^ )<br/><br/>Mathematical functions:<br/>abs[x] : Absolute value (magnitude) of x<br/>acos[x] : Arc cosine of x (in radians)<br/>acosh[x] : Hyperbolic arc cosine of x (in radians)<br/>asin[x] : Arc sine of x (in radians)<br/>asinh[x] : Hyperbolic arc sine of x (in radians)<br/>atan[x] : Arc tangent of x (in radians)<br/>atanh[x] : Hyperbolic arc tangent of x (in radians)<br/>cbrt[x] : Cube root of x<br/>ceil[x] : Ceiling of x — the smallest integer that’s >= x<br/>cos[x] : Cosine of x (x is in radians)<br/>cosh[x] : Hyperbolic cosine of x (x is in radians)<br/>exp[x] : e^x (exponential/antilogarithm function with base e)<br/>floor[x] : Floor of x — the largest integer that’s <= x<br/>ln[x] : Natural logarithm of x<br/>log[x] : Natural logarithm of x (synonym for ln, not base-10)<br/>log10[x] :	Base-10 logarithm of x<br/>log2[x] : Base-2 logarithm of x<br/>round[x] :	X, rounded to the nearest integer<br/>sign[x] : Sign of x (-1, 0, or 1 for negative, zero, or positive respectively)<br/>sin[x] : Sine of x (x is in radians)<br/>sinh[x] : Hyperbolic sine of x (x is in radians)<br/>sqrt[x] : Square root of x. Result is NaN (Not a Number) if x is negative.<br/>tan[x] : Tangent of x (x is in radians)<br/>tanh[x] : Hyperbolic tangent of x (x is in radians)<br/> <br/><br/>Pre-defined functions:<br/>random(n) : Get a random number in the range [0, n). If n is zero, or not provided, it defaults to 1.<br/>fac(n)	n! : (factorial of n: \"n * (n-1) * (n-2) * … * 2 * 1\") Deprecated. Use the ! operator instead.<br/>min(a,b,…) : Get the smallest (minimum) number in the list.<br/>max(a,b,…) : Get the largest (maximum) number in the list.<br/>hypot(a,b) : Hypotenuse, i.e. the square root of the sum of squares of its arguments.<br/>pyt(a, b) : Alias for hypot.<br/>pow(x, y) : Equivalent to x^y.<br/>roundTo(x, n... (type help for more)";
        } else {
             result = this.evaluteExp(command);
        }

        const resultRow = (
             <div key={`res-${Date.now()}`} className="my-2 font-normal" dangerouslySetInnerHTML={{ __html: result }}></div>
        );
        
        this.setState(prevState => ({
            outputList: [...prevState.outputList, commandRow, resultRow],
            userInput: '',
            cursorPos: 0
        }));
    }

    evaluteExp = (command) => {
        let result = "";
        let expr;
            try{
                expr=parser.parse(command)
                try{
                    result = parser.evaluate(command,this.variables)
                    if(expr.tokens.length===2&&expr.tokens[2].type==="IOP2")
                    this.variables[expr.variables()[0]]=result
                }
                catch (e) {
                    result = e.message;
                }
            }
            catch(e){
                result="Invalid Expression"
            }    
        return result;
    }
    xss(str) {
        if (!str) return;
        return str.split('').map(char => {
            switch (char) {
                case '&':
                    return '&amp';
                case '<':
                    return '&lt';
                case '>':
                    return '&gt';
                case '"':
                    return '&quot';
                case "'":
                    return '&#x27';
                case '/':
                    return '&#x2F';
                default:
                    return char;
            }
        }).join('');
    }
    

    render() {
        return (
            <div className="h-full w-full bg-ub-drk-abrgn text-ubt-grey opacity-100 p-1 float-left font-normal flex flex-col">
                <div 
                    ref={this.containerRef}
                    className="text-white text-sm font-bold bg-ub-drk-abrgn overflow-y-auto flex-1" 
                    id="calculator-body"
                    onClick={this.focusCursor}
                >
                    {this.state.outputList}
                    {this.renderInputLine('', '')}
                </div>
            </div>
        )
    }
}

export default Calc

export const displayTerminalCalc = (openApp) => {
    return <Calc openApp={openApp}> </Calc>;
}
