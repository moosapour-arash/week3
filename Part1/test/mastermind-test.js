//[assignment] write your own unit test to show that your Mastermind variation circuit is working as expected
const chai = require("chai");
const path = require("path");

const wasm_tester = require("circom_tester").wasm;

const F1Field = require("ffjavascript").F1Field;
const Scalar = require("ffjavascript").Scalar;
exports.p = Scalar.fromString("21888242871839275222246405745257275088548364400416034343698204186575808495617");
const Fr = new F1Field(exports.p);

const assert = chai.assert;

describe("Mastermind Variation test", function () {
    this.timeout(100000000);

    it("should pass when correct inputs are given", async () => {
        const circuit = await wasm_tester("contracts/circuits/MastermindVariation.circom");
        await circuit.loadConstraints();

        const INPUT = {
            "pubGuessA": "3",
            "pubGuessB": "5",
            "pubGuessC": "6",
            "pubNumHit": "1",
            "pubNumBlow": "1",
            "pubSolnHash": "4950467835966595991285466336173482639268710909318362475335742246511448172469",

            "privSolnA": "3",
            "privSolnB": "0",
            "privSolnC": "5",

            "privSalt": "999999",
        }

        const witness = await circuit.calculateWitness(INPUT, true);

        assert(Fr.eq(Fr.e(witness[0]),Fr.e(1))); //constant
        assert(Fr.eq(Fr.e(witness[1]),Fr.e(4950467835966595991285466336173482639268710909318362475335742246511448172469n)));//out
        assert(Fr.eq(Fr.e(witness[2]),Fr.e(3n)));//pubGuessA
        assert(Fr.eq(Fr.e(witness[3]),Fr.e(5n)));//pubGuessB
        assert(Fr.eq(Fr.e(witness[4]),Fr.e(6n)));//pubGuessC
        assert(Fr.eq(Fr.e(witness[5]),Fr.e(1n)));//pubNumHit
        assert(Fr.eq(Fr.e(witness[6]),Fr.e(1n)));//pubNumBlow
        assert(Fr.eq(Fr.e(witness[7]),Fr.e(4950467835966595991285466336173482639268710909318362475335742246511448172469n)));//pubSolnHash
    });
});