import './App.css'
import {useState,useEffect} from 'react'
import Github from './Github'
import Toast from './Toast'
export default function App(){
  const [toast,setToast] = useState<{msg:string,ok:boolean}>({msg:"",ok:false})
  const [matrix,setMatrix] = useState<number[][]>([])
  const [resStr,setResStr] = useState<string>("")
  const [animationSpeed,setAnimationSpeed] = useState<number>(1)
  const [run,setRun] = useState<boolean>(false)
  function clearToast(){
    setTimeout(() => {
        setToast({msg:"",ok:false})
    }, 3000);
  }
  function generateMatrix(){
    let res:number[][] = []
    for(let i = 0; i < 32; i++){
      let temp:number[] = []
      for(let y = 0; y < 32; y++){
        const random = Math.floor(Math.random() * 2)
        temp.push(random)
      }
      res.push(temp)
    }
    setMatrix(res)
  }
  function getAliveNeighbors(pos:number[],matrix:number[][]){
    let res = 0
    if(pos[0] < matrix.length - 1){
      if(matrix[pos[0] + 1][pos[1]] === 1){res++}
    }
    if(pos[0] > 0){
      if(matrix[pos[0] - 1][pos[1]] === 1){res++}
    }
    if(pos[1] < matrix[0].length - 1){
      if(matrix[pos[0]][pos[1] + 1] === 1){res++}
    }
    if(pos[1] > 0){
      if(matrix[pos[0]][pos[1] - 1] === 1){res++}
    }
    if(pos[0] < matrix.length - 1 && pos[1] < matrix[0].length - 1){
      if(matrix[pos[0] + 1][pos[1] + 1] === 1){res++}
    }
    if(pos[0] > 0 && pos[1] > 0){
      if(matrix[pos[0] - 1][pos[1] - 1] === 1){res++}
    }
    if(pos[0] > 0 && pos[1] < matrix[0].length - 1){
      if(matrix[pos[0] - 1][pos[1] + 1] === 1){res++}
    }
    if(pos[0] < matrix.length - 1 && pos[1] > 0){
      if(matrix[pos[0] + 1][pos[1] - 1] === 1){res++}
    }
    return res
  }
  function determineFate(neighbors:number,state:number){
    if(state === 1){
      if(neighbors < 2 || neighbors > 3){
        return false
      } return true
    } else {
      if(neighbors === 3){
        return true
      } return false
    }
  }
  function visualize(){
    let res = ''
    for(let i = 0; i < matrix.length; i++){
      let tmp = ''
      for(let x = 0; x < matrix[i].length; x++){
        tmp += matrix[i][x] === 0 ? '⬛' : '⬜'
      }
      res += tmp + '\n'
    }
    return res
  }
  useEffect(() => {
    setResStr(visualize())
  }, [matrix])
  useEffect(() => {
    if (!run) {
      return
    }
    const intervalId = window.setInterval(() => {
      setMatrix((prevMatrix) => {
        if (prevMatrix.length === 0) {
          return prevMatrix
        }

        return prevMatrix.map((row, i) => {
          return row.map((cell, x) => {
            return determineFate(getAliveNeighbors([i, x], prevMatrix), cell) ? 1 : 0
          })
        })
      })
    }, Math.max(500, 5000 - animationSpeed * 1000))
    return () => {
      window.clearInterval(intervalId)
    }
  }, [run, animationSpeed])
  useEffect(()=>{
    generateMatrix()
  },[])
  return (
    <div className='font-mono p-4'>
      <div className='flex justify-center items-center flex-col'>
          <h1 className='text-2xl'>Conway's Game of Life Simulation (32x32)</h1>
          <h6>⬛:Dead ⬜:Alive</h6>
          <div className='flex justify-center items-center flex-col'>
              <label htmlFor='animSpeed'>Animation Speed: {animationSpeed}x</label>
              <input type='range' onChange={(e)=>{
                setRun(false)
                setAnimationSpeed(parseFloat(e.target.value))
              }} className='border border-black rounded-lg' max={4.5} min={0.5} value={animationSpeed} />
            <div>
              <button className='border border-black rounded-lg p-2' onClick={()=>{
                if(run === false){
                  setRun(true)
                  setToast({msg:"Started animation.",ok:true})
                }else{
                  setRun(false)
                  setToast({msg:"Stopped animation.",ok:true})
                  setResStr('')
                  generateMatrix()
                }
                clearToast()
              }}>{run === false ? 'Run animation' : 'Cancel animation'}</button>
            </div>
          </div>
          <div>
            {run === true && resStr.length > 0 && (
              <div className='text-sm whitespace-pre text-center'>
                {resStr}
              </div>
            )}
          </div>
      </div>
      {toast.msg.length > 0 && (
        <Toast msg={toast.msg} ok={toast.ok}/>
      )}
      <Github url={'a'}/>
    </div>
  )
}