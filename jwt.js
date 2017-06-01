#!/usr/bin/env node
/*
 * Copyright 2017 Alyssa Herzog <AlyssaDaemon@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software 
 * and associated documentation files (the "Software"), to deal in the Software without restriction, 
 * including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
 * and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, 
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial 
 * portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE 
 * AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, 
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const jwt = require("jsonwebtoken"),
      EventEmitter = require('events'),
      path = require("path");

let args   = process.argv.slice(2),
    verify = undefined,
    token  = args.slice().pop(),
    DONE   = false;

if (args.includes("-h") || args.includes("--help")) return usage();

if (token === undefined) return usage(1);

if (args.includes("-s") || args.includes("--sign")) {
  let argv = args.indexOf("-s");
  if (argv === -1) argv = args.indexOf("--sign")
  if (!args[argv+1] || !args[argv+2]) {
    console.error("Not enough arguments for sign");
    return usage(2);
  }
  try {
    let json = args[argv+2];
    console.log(jwt.sign(JSON.parse(args[argv+2]),args[argv+1]));
  } catch (e) {
    console.error(e.message || e);
    return usage(128);
  }
  return process.exit(0);
}

if (args.includes("-v") || args.includes("--verify")) {
  let argv = args.indexOf("-v");
  if (argv === -1) argv = args.indexOf("--verify")
  verify = args[argv+1];
  if (verify === token) {
    console.error("Verify option requires an argument");
    return usage(2);
  }

}

console.dir(verifyJWT(token, verify));

function usage(code = 0){
  console.log("Usage:", path.basename(process.argv[1]), "[options] <jsonwebtoken> | -s <secret> <json_payload>");
  console.log("");
  console.log("Options:");
  console.log("\t-v, --verify secret: Verify the jsonwebtoken with the secret");
  console.log("\t-h, --help: Show this help.");
  console.log("\t-s,--sign secret object: Create a JWT signed by secret")
  process.exit(code);
}

function verifyJWT(token, verify) {
  if (verify) {
    let tk = {};
    try {
      tk = jwt.verify(token,verify);
    } catch (e) {
      console.error(e.message);
      tk = jwt.decode(token);
    }
    return tk;
  } else {
    return jwt.decode(token);
  }
}
