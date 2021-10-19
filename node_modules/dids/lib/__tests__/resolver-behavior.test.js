"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const did_resolver_1 = require("did-resolver");
const utils = __importStar(require("../utils"));
utils.randomString = () => 'rWCXyH1otp5/F78tycckgg';
global.Date.now = jest.fn(() => 1606236374000);
const did_1 = require("../did");
test('uses the given Resolver instance', () => {
    const resolver = new did_resolver_1.Resolver();
    const did = new did_1.DID({ resolver });
    expect(did._resolver).toBe(resolver);
});
test('uses the given Resolver config', () => __awaiter(void 0, void 0, void 0, function* () {
    const res = {
        didDocument: {},
        didResolutionMetadata: {},
    };
    const registry = {
        test: jest.fn(() => Promise.resolve(res)),
    };
    const did = new did_1.DID({ resolver: registry });
    expect(did._resolver).toBeInstanceOf(did_resolver_1.Resolver);
    yield expect(did.resolve('did:test:test')).resolves.toBe(res);
}));
test('creates a Resolver instance when none is provided', () => {
    const did = new did_1.DID();
    expect(did._resolver).toBeInstanceOf(did_resolver_1.Resolver);
});
test('setProvider method', () => {
    const did = new did_1.DID();
    const resolver = did._resolver;
    did.setResolver({});
    expect(did._resolver).toBeInstanceOf(did_resolver_1.Resolver);
    expect(did._resolver).not.toBe(resolver);
});
//# sourceMappingURL=resolver-behavior.test.js.map