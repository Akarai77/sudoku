// Board.js
import React, { useEffect, useState } from 'react';
import './App.css';
import { getGrid } from './getGrid';
import { useTimer } from './Timer';

const App = () => {
  const [N, setN] = useState(9);
  const [grids, setGrids] = useState(null);
  const [enteredGrid,setEnteredGrid] = useState(null);
  const [difficulty, setDifficulty] = useState('easy');
  const [content,setContent] = useState("Hello World!");
  const [active, setActive] = useState([]);
  const [helpCount,setHelpCount] = useState(0);
  const [isHelpAvailable,setHelpAvailable] = useState(true);
  const [isCorrect,setIsCorrect] = useState([]);
  const [cheated,setCheated] = useState(false);
  const [gameEnd,setGameEnd] = useState(false);
  const [err, setErr] = useState(false);
  const [isValid,setIsValid] = useState(false);
  const [isSolvable,setIsSolvable] = useState(true);
  const [isSubmittable,setSubmittable] = useState(false);
  const { time, minutes, seconds, startTimer, stopTimer, resetTimer } = useTimer();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);


  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  }

  useEffect(()=>{
    window.addEventListener('resize',handleResize);
  },[])

  useEffect(()=>{
    if(helpCount === 3)
        setHelpAvailable(false);
  },[helpCount])

  useEffect(() => {
    let newArray = Array.from({ length: N }, () => Array(N).fill(false));
    setActive(newArray);
    newArray = Array.from({ length: N }, () => Array(N).fill(null));
    setIsCorrect(newArray);
  }, [N]);

  useEffect(() => {
    setGrids(getGrid(N, difficulty));
  }, [N, difficulty]);

  useEffect(()=>{
    console.log(enteredGrid);
    if(grids){
        if(enteredGrid === grids.solvedGrid && !isSubmittable){
            const newArray = enteredGrid.map((innerArray,rowIndex)=>(
                innerArray.map((value,colIndex)=>(
                    value === grids.solvedGrid[rowIndex][colIndex] ? true : false
                ))
            ))
            setIsCorrect(newArray);
        }
    }
    // if(enteredGrid){
    //     const rowArray = [];
    //     const colArray = [];
    //     const gridArray = [];

    //     for(var i = 0;i < N;i++){
    //         rowArray[i] = [];
    //         colArray[i] = [];
    //         gridArray[i] = [];
    //         for(var j = 0;j < N;j++){
    //             rowArray[i].push(enteredGrid[i][j]);
    //             colArray[i].push(enteredGrid[j][i]);
    //             const ri = Math.floor(i/3)*3+Math.floor(j/3);
    //             const ci = j%3+i%3*3;
    //             gridArray[i].push(enteredGrid[ri][ci]);
    //         }
    //     }
    // }
  },[enteredGrid,isSubmittable,grids])

useEffect(()=>{
    console.log(grids)
},[grids])

  useEffect(()=>{
    if(grids!==null){
        setEnteredGrid(grids.unsolvedGrid);
    }
  },[grids])

  const handleInput = (e, ri, ci) => {
    let value = parseInt(e.target.value);
    if(!isNaN(value))
        e.target.value = value;
    console.log(value,e.target.value)
    
    if (value < 1 || value > 9) {
      setErr(true);
      setContent("Number should be greater than 0 and less than 9!");
      setTimeout(() => {
        setErr(false);
      }, 2000);

      e.target.value = Math.floor(value / 10);
      value = parseInt(e.target.value) || '';
    } else if (isNaN(value)) {
      e.target.value = '';
      value = '';
    } 

    const newArray = active.map((rowArray, row) =>
      rowArray.map((item, col) => (ri === row && ci === col ? !isNaN(value) && value !== '' : item))
    );
    setActive(newArray);
    
    const newUnsolvedGrid = enteredGrid.map((row, rowIndex) =>
      row.map((cell, colIndex) => (rowIndex === ri && colIndex === ci ? value : cell))
    );
    setEnteredGrid(newUnsolvedGrid);
  };
  

  const handleReset = () => {
    if (!grids || !enteredGrid) return;
  
    const { solvedGrid, unsolvedGrid } = grids;
  
    const resetUnsolvedGrid = enteredGrid.map((row, rowIndex) =>
      row.map((_, colIndex) => {

        if (enteredGrid[rowIndex][colIndex] !== unsolvedGrid[rowIndex][colIndex]) {
            const newArray = Array.from({ length: N }, () => Array(N).fill(false));
            setActive(newArray);
          return ' '; 
        }
        return enteredGrid[rowIndex][colIndex];
      })
    );
  
    setGrids({ solvedGrid, unsolvedGrid: resetUnsolvedGrid });
  };

  const handleHelp = async() =>{
        if (!grids || !enteredGrid) return;
        setHelpCount(helpCount+1);
        let newArray = enteredGrid.map((innerArray,rowIndex)=>(
            innerArray.map((value,colIndex)=>(
                value === grids.solvedGrid[rowIndex][colIndex] ? true : false
            ))
        ));
        setIsCorrect(newArray);
        setIsSolvable(false);

        setTimeout(()=>{
            setIsSolvable(true);
            newArray = Array.from({ length: N }, () => Array(N).fill(null));
            setIsCorrect(newArray);
        },2000);
  };

  const handleSolve = () =>{
    if (!grids || !enteredGrid) return;
    setSubmittable(false);
    setCheated(true);
    setContent(`You Gave Up After ${minutes} minute(s) and ${seconds} seconds`);
    stopTimer();
    setEnteredGrid(grids.solvedGrid);
  };
  

  const handleChange = () => {
    resetTimer();
    setGrids(getGrid(N, difficulty));
    let newArray = Array.from({ length: N }, () => Array(N).fill(false));
    setActive(newArray);
    newArray = Array.from({ length: N }, () => Array(N).fill(null));
    setIsCorrect(newArray);
    setIsValid(false);
  };

  const handleStart = () => {
    resetTimer();
    startTimer();
    setGameEnd(false);
    setIsValid(true);
    setSubmittable(true);
  };

  const doNothing = () =>{
    
  }

  const handleSubmit = () =>{
    stopTimer();
    let correct = 0;
    let incorrect = 0;

    enteredGrid.forEach((rowArray,rowIndex)=>{
        rowArray.forEach((value,colIndex)=>{
            value === grids.unsolvedGrid[rowIndex][colIndex] && value !== ' ' ? doNothing() : value === grids.solvedGrid[rowIndex][colIndex] ? correct++ : incorrect++
        })
    })
    setGameEnd(true);
    setSubmittable(false);
    setContent(<span> You got <span style={{color: 'rgb(81, 248, 81)'}}>{correct}</span> right and  <span style={{color: 'rgb(255, 55, 55)'}}>{incorrect}</span> wrong in {time} seconds</span>);

    const newArray = enteredGrid.map((innerArray,rowIndex)=>(
        innerArray.map((value,colIndex)=>(
            value === grids.solvedGrid[rowIndex][colIndex] ? true : false
        ))
    ));
    setIsCorrect(newArray);
  };


  return (
    <div className="App">
      <div className="container">
        <div className="title">SUDOKU</div>

        <div className={`msg ${err ? 'error' : ''} ${gameEnd ? 'result' : ''} ${cheated ? 'cheated' : ''}`}>
          {content}
        </div>

        <div className="game">

          <div className="settings">
            <div className="timer">{minutes}:{seconds}</div>
            <div className={`difficulty ${isValid ? 'invalid' : ''}`}>
              <select onChange={(e) => setDifficulty(e.target.value)} value={difficulty}>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
                <option value="hardest">Hardest</option>
              </select>
            </div>
          </div>

          <div className={`board ${isValid ? '' : 'invalid'}`}>
            {grids && enteredGrid &&
              Array.from({ length: 9 }).map((_, gridIndex) => (
                <div key={gridIndex} className="grid">
                  {Array.from({ length: 3 }).map((_, rowIndex) => (
                    <div key={rowIndex} className="row">
                      {Array.from({ length: 3 }).map((_, colIndex) => {
                        let ri = rowIndex + Math.floor(gridIndex / 3) * 3;
                        let ci = colIndex + (gridIndex % 3) * 3;
                        if (grids.unsolvedGrid[ri][ci] === ' ') {
                          return (
                            <div key={colIndex} className={`cell empty ${active[ri][ci] ? 'active' : ''} ${isCorrect[ri][ci] === null ? '' : isCorrect[ri][ci] ? 'correct': 'incorrect'}`}>
                              <input
                                id={`${ri}${ci}`}
                                min={1}
                                max={9}
                                type="number"
                                onInput={(e) => handleInput(e, ri, ci)}
                                value={enteredGrid[ri][ci] === ' ' ? '' : enteredGrid[ri][ci]}
                              />
                            </div>
                          );
                        } else {
                          return (
                            <div key={colIndex} className="cell filled">
                              {grids.unsolvedGrid[ri][ci]}
                            </div>
                          )
                        }
                      })}
                    </div>
                  ))}
                </div>
              ))}
          </div>

          <div className='buttons'>
            <div className={`reset ${isSubmittable && isSolvable ? '' : 'invalid'}`}>
              <button onClick={handleReset}>{windowWidth < 900 ? 'R' : 'RESET'}</button>
            </div>
            <div className={`help ${isSubmittable && isHelpAvailable ? '' : 'invalid'}`}>
              <button onClick={handleHelp}>{windowWidth < 900 ? 'H' : 'HELP'}</button>
            </div>
            <div className={`solve ${isValid && !gameEnd && isSolvable ? '' : 'invalid'}`}>
              <button onClick={handleSolve}>{windowWidth < 900 ? 'S' : 'SOLVE'}</button>
            </div>
          </div>

        </div>

        <div className='start'>
          <button onClick={handleChange}>CHANGE</button>
          <button className={`${isValid ? 'invalid' : ''}`} onClick={handleStart}>START</button>
          <button className={`${isSubmittable ? '' : 'invalid'}`} onClick={handleSubmit}>SUBMIT</button>
        </div>

        
      </div>
    </div>

  );
};

export default App;
