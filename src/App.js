import { useReducer } from "react"
import DigitButton from "./DightButton";
import OperationButton from "./OperationButton";
import "./styles.css";


//global variables
export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate'
}

function reducer(state, { type, payload }){
   switch(type){
    case ACTIONS.ADD_DIGIT:
      if(state.overwrite == true){
        return{
          ...state,
          currentOperand: payload.digit,
          overwrite: false  
        }
      }
      if(payload.digit === "0" && state.currentOperand === "0") return state; //to avoid back to back zeroes
      if(payload.digit === "." && state.currentOperand.includes(".")) return state;//to avoid more than one period
      return {
        ...state,  
        currentOperand: `${state.currentOperand || ""}${payload.digit}`  //joining currentoperand and new digit
      }
    case ACTIONS.CHOOSE_OPERATION:
      if(state.currentOperand == null && state.previousOperand == null){ //checking if our currentoperand and previousoperanfd is added
        return state;
      }
      if(state.currentOperand == null){
        return{
          ...state,
          operation: payload.operation
        }
      }
      if(state.previousOperand == null){
        return{
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand ,
          currentOperand: null
        }
      }
      return{
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null 
      }

    case ACTIONS.CLEAR:
      return{}
    case ACTIONS.DELETE_DIGIT:
      if(state.overwrite) 
        return{
          ...state,
          overwrite: false,
          currentOperand: null
        }
      if(state.currentOperand == null) return state;
      if(state.currentOperand.length == 1) 
        return {
          ...state,
          currentOperand: null
        }; 
      return{
        ...state,
        currentOperand: state.currentOperand.slice(0,-1) // will remove last digit 
      } 
    case ACTIONS.EVALUATE:
      if(state.operation == null || state.previousOperand == null || state.currentOperand == null){ // checking if one of the operand is null or not
        return state;
      }
      return{
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state)
      }
   }
   
}

function evaluate({currentOperand, previousOperand, operation}){
  const prev = parseFloat(previousOperand);
  const curr = parseFloat(currentOperand);
  if(isNaN(prev) || isNaN(curr)) return "";
  let computation = "";
  switch(operation){
    case "+":
      computation = prev + curr;
      break;
    case "-":
      computation = prev - curr;
      break;
    case "*":
      computation = prev * curr;
      break;
    case "/":
      computation = prev / curr;
      break;
  
  }
  return computation.toString();
}

const INTERGER_FORMATTER = new Intl.NumberFormat("en-us", { // to add commas
  maximumFractionDigits: 0
})

function formatOperand(operand){
  if(operand == null) return;
  const[integer, decimal] = operand.split('.'); // eg=12.0, then integer = 12, decimal = 0
  if(decimal == null) return INTERGER_FORMATTER.format(integer);
  return `${INTERGER_FORMATTER.format(integer)}.${decimal}`
}

function App() {
  const [{currentOperand, previousOperand, operation}, dispatch] = useReducer(reducer,{});

  // dispatch({
  //   type: ACTIONS.ADD_DIGIT,
  //   payload: {digit: 1}
  // });
  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">{formatOperand(previousOperand)} {operation}</div>
        <div className="current-operand">{formatOperand(currentOperand)}</div>
      </div>
        <button className="span-two" onClick={() => dispatch({type: ACTIONS.CLEAR })}>AC</button> {/*because AC button takes 2 spaces*/}
        <button onClick={() => dispatch({type: ACTIONS.DELETE_DIGIT })}>DEL</button>
        <OperationButton operation="/" dispatch={dispatch} />

        <DigitButton digit="1" dispatch={dispatch} />
        <DigitButton digit="2" dispatch={dispatch} />
        <DigitButton digit="3" dispatch={dispatch} />
        <OperationButton operation="*" dispatch={dispatch} />
        <DigitButton digit="4" dispatch={dispatch} />
        <DigitButton digit="5" dispatch={dispatch} />
        <DigitButton digit="6" dispatch={dispatch} />
        <OperationButton operation="+" dispatch={dispatch} />
        <DigitButton digit="7" dispatch={dispatch} />
        <DigitButton digit="8" dispatch={dispatch} />
        <DigitButton digit="9" dispatch={dispatch} />
        <OperationButton operation="-" dispatch={dispatch} />
        
        <DigitButton digit="." dispatch={dispatch} />
        <DigitButton digit="0" dispatch={dispatch} />
        <button className="span-two" onClick={() => dispatch({type: ACTIONS.EVALUATE})}>=</button>



    </div>
  );
}

export default App;
