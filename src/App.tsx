import React, { createRef, useEffect, useRef, useState } from 'react';
import './App.css';
import { ReactSketchCanvas, ReactSketchCanvasRef } from 'react-sketch-canvas';

function App() {
  const [imgsrc, Setimgsrc] = useState<string | null>(null);
  const [loading, SetLoading] = useState<boolean>(false);
  const canvas = createRef<ReactSketchCanvasRef>();
  const endpoint = "https://cvsemi2024-c7fd9763bc5a.herokuapp.com";
  const onClick = async () => {
    Setimgsrc(null);
    SetLoading(true);

    const dataUrl = await canvas.current?.exportImage('png');

    if (dataUrl) {
      // base64をBlobに変換
      const response = await fetch(dataUrl);
      const blob = await response.blob();

      // FormDataにBlobを追加
      const formData = new FormData();
      formData.append('file', blob, 'canvas.png');

      // サーバにPOSTリクエストを送信
      const serverResponse = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      const result = await serverResponse.json();
      console.log('Success:', result);
      Setimgsrc(endpoint + "/static/output_" + result["id"] + ".png")
      SetLoading(false);
    }
  }
  return (
    <div className="App">
      <h1>描いた都道府県発表ドラゴン</h1>
      <a href='https://github.com/ret2home/cvsemi2024' target='_blank'>GitHub</a>
      {imgsrc &&
        <img src={imgsrc} />
      }
      {loading &&
        <h3>Loading...</h3>
      }
      <div><button onClick={onClick} style={{margin: '15px'}}>発表！</button></div>
      {canvas &&
        <div>
          <ReactSketchCanvas ref={canvas} height="500px" strokeColor='black' strokeWidth={6} />
        </div>
      }
    </div>
  );
}

export default App;
