import * as faceapi from "face-api.js";

export async function captureFacialExpression(videoElement, duration = 10000) {
  const expressionsArray = [];
  const interval = 300; // every 300ms
  const endTime = Date.now() + duration;

  return new Promise((resolve) => {
    const intervalId = setInterval(async () => {
      const result = await faceapi
        .detectSingleFace(videoElement, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();

      if (result?.expressions) {
        expressionsArray.push(result.expressions);
      }

      if (Date.now() >= endTime) {
        clearInterval(intervalId);

        // Average the expressions
        const avg = {};
        const keys = Object.keys(expressionsArray[0] || {});
        keys.forEach((key) => {
          avg[key] =
            expressionsArray.reduce((sum, expr) => sum + (expr[key] || 0), 0) /
            expressionsArray.length;
        });

        const facialExpressionScore =
          (avg.happy || 0) - (avg.sad || 0) - (avg.angry || 0);

        resolve({
          happiness: avg.happy,
          sadness: avg.sad,
          surprise: avg.surprised,
          anger: avg.angry,
          facialExpressionScore,
        });
      }
    }, interval);
  });
}
