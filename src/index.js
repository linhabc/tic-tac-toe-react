import React from 'react';
import ReactDOM from 'react-dom';

import { Container, Button } from 'reactstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

function Square(props){
    return (
      <button 
        className="square" 
        onClick={props.onClick}
      >
        {props.value}
      </button>
    );
  }
  
  class Board extends React.Component {

    renderSquare(i) {
      return (
        <Square 
          value={this.props.squares[i]}
          onClick={()=>{this.props.onClick(i)}}
        />
      );
    }
  
    render() {
      return (
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props){
      super(props);

      this.state = {
        history: [
          {squares: Array(9).fill(null)},
        ],
        stepNumber: 0,
        xIsNext: true
      };

      this.handleClick = this.handleClick.bind(this);
    }

    handleClick(i){
      const {history, stepNumber, xIsNext} = this.state;
      const curHistory = history.slice(0, stepNumber+1);
      const squares = history[curHistory.length - 1].squares.slice();
      // const squares = history[curHistory.length - 1].squares;
      // console.log(squares);
      //using squares without .slice() make error that history array elements are the same!!!!!!!!!


      //handle click if someone has won or the square is fill
      if(calculateWinner(squares) || squares[i]) return;

      squares[i] = xIsNext?'X':'O';
      this.setState({
        history: curHistory.concat([{
          squares: squares
        }]),
        stepNumber: curHistory.length,
        xIsNext: !xIsNext
      });
    }

    // andleClick(i) {
    //   const history = this.state.history.slice(0, this.state.stepNumber + 1);
    //   const current = history[history.length - 1];
    //   const squares = current.squares.slice();

    // }

    jumpToMove(index){
      this.setState({
        stepNumber: index,
        xIsNext: (index%2) === 0
      });
      // console.log('this.state.stepNumber '+this.state.stepNumber);
      // console.log('index '+index);
    }

    render() {
      const {history, stepNumber, xIsNext} = this.state;
      const squares = history[stepNumber].squares;
      const winner = calculateWinner(squares);
      let status;

      if(winner){
        if(winner==='NONE'){
          status = 'DRAW';
        }
        else
          status = 'WINNER: ' + winner;
      }else{
        const player = xIsNext ? 'X' : 'O';
        status = 'Next player: ' + player;
      }

      const moves = history.map((moves, index)=>{
        const description = index ? 'Go to move: ' + index : 'Go to game start';//check whether it is first move or not
        
        return (
          <li key={index}>
            <Button color="primary" onClick={()=>{
              return this.jumpToMove(index);
            }}>{description}</Button> 
          </li>
        );
      });



      return (
        <Container>
          <div className="game">
            <div className="game-board">
              <Board 
                onClick={this.handleClick}//onClick={(i) => this.props.onClick(i)}
                squares={squares}
              />
            </div>
            <div className="game-info">
              <h2>{status}</h2>
              <ul>{moves}</ul>
            </div>
          </div>
        </Container>
      );
    }
  }

  function  calculateWinner(squares) {
    let i;
    const MAXSQUARE = 9;
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) { //check winner
        return squares[a];
      }
    }

    //check draw
    for(i=0; i<MAXSQUARE; i++){
      if(!squares[i])
        break;
    }
   
    if(i===MAXSQUARE)
      return 'NONE';
    //check draw

    return null;
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  