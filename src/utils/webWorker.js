export default class WebWorker {
  constructor(worker) {
    const code = worker.toString();
    const blob = new Blob(["(" + code + ")()"]);
    const pass = URL.createObjectURL(blob);
    return new Worker(pass);
  }
}
