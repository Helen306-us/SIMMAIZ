import fs from 'fs';

async function testWorkflow() {
  try {
    const base64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
    const response = await fetch('https://serverless.roboflow.com/helens-workspaceteoria/workflows/detect-and-classify-2', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: '9Y0JlZ8NmbMLpo4Qcui1',
        inputs: {
          image: { type: 'base64', value: base64 }
        }
      })
    });
    const result = await response.json();
    fs.writeFileSync('roboflow_output2.json', JSON.stringify(result, null, 2));
    console.log('Saved to roboflow_output2.json');
  } catch(e) {
    fs.writeFileSync('roboflow_output2.txt', e.toString());
  }
}
testWorkflow();
