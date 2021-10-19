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
const u8a = __importStar(require("uint8arrays"));
const random_1 = require("@stablelib/random");
const x25519_1 = require("@stablelib/x25519");
const did_jwt_1 = require("did-jwt");
const dag_jose_utils_1 = require("dag-jose-utils");
const utils = __importStar(require("../utils"));
utils.randomString = () => 'rWCXyH1otp5/F78tycckgg';
const { encodeBase64, encodeBase64Url } = utils;
global.Date.now = jest.fn(() => 1606236374000);
const did_1 = require("../did");
const MOCK_AUTH_JWS = {
    payload: 'eyJkaWQiOiJkaWQ6a2V5Ono2TWtvQ0hZWExIQVdIUFBWTUJTZTluUWN0ZVRtblkzMkdkQlFNWXAxM2NkYWNEVSIsImV4cCI6MTYwNjIzNjM3NCwibm9uY2UiOiJyV0NYeUgxb3RwNS9GNzh0eWNja2dnIn0',
    signatures: [
        {
            protected: 'eyJhbGciOiJFZERTQSIsImtpZCI6ImRpZDprZXk6ejZNa29DSFlYTEhBV0hQUFZNQlNlOW5RY3RlVG1uWTMyR2RCUU1ZcDEzY2RhY0RVI3o2TWtvQ0hZWExIQVdIUFBWTUJTZTluUWN0ZVRtblkzMkdkQlFNWXAxM2NkYWNEVSJ9',
            signature: 'iNsGriqC2s-TXBPbOR5C5djZc2iKV47wuPC2f2aXlX64uB-DX1dFFFgfrogFcwd2WR5R46ya-0Hu3wZbKqUTDg',
        },
    ],
};
const MOCK_NONCE = 'rWCXyH1otp5/F78tycckgg';
const MOCK_DID = 'did:key:z6MkoCHYXLHAWHPPVMBSe9nQcteTmnY32GdBQMYp13cdacDU';
const MOCK_RESOLVER_RESULT = {
    didResolutionMetadata: {},
    didDocumentMetadata: {},
    didDocument: {
        '@context': 'https://w3id.org/did/v1',
        id: 'did:key:z6MkoCHYXLHAWHPPVMBSe9nQcteTmnY32GdBQMYp13cdacDU',
        verificationMethod: [
            {
                id: 'did:key:z6MkoCHYXLHAWHPPVMBSe9nQcteTmnY32GdBQMYp13cdacDU#z6MkoCHYXLHAWHPPVMBSe9nQcteTmnY32GdBQMYp13cdacDU',
                type: 'Ed25519VerificationKey2018',
                controller: 'did:key:z6MkoCHYXLHAWHPPVMBSe9nQcteTmnY32GdBQMYp13cdacDU',
                publicKeyBase58: '9k2Vw62jAjtvNrLjxapZmo6TxDGBcPNpiLdtAmecfPS6',
            },
        ],
        authentication: [
            'did:key:z6MkoCHYXLHAWHPPVMBSe9nQcteTmnY32GdBQMYp13cdacDU#z6MkoCHYXLHAWHPPVMBSe9nQcteTmnY32GdBQMYp13cdacDU',
        ],
        assertionMethod: [
            'did:key:z6MkoCHYXLHAWHPPVMBSe9nQcteTmnY32GdBQMYp13cdacDU#z6MkoCHYXLHAWHPPVMBSe9nQcteTmnY32GdBQMYp13cdacDU',
        ],
        capabilityDelegation: [
            'did:key:z6MkoCHYXLHAWHPPVMBSe9nQcteTmnY32GdBQMYp13cdacDU#z6MkoCHYXLHAWHPPVMBSe9nQcteTmnY32GdBQMYp13cdacDU',
        ],
        capabilityInvocation: [
            'did:key:z6MkoCHYXLHAWHPPVMBSe9nQcteTmnY32GdBQMYp13cdacDU#z6MkoCHYXLHAWHPPVMBSe9nQcteTmnY32GdBQMYp13cdacDU',
        ],
        keyAgreement: [
            {
                id: 'did:key:z6MkoCHYXLHAWHPPVMBSe9nQcteTmnY32GdBQMYp13cdacDU#z6LSpCEVAwDkybHxQM2X6bfhjZA7ac7DVSX3PA6GYqGjue3b',
                type: 'X25519KeyAgreementKey2019',
                controller: 'did:key:z6MkoCHYXLHAWHPPVMBSe9nQcteTmnY32GdBQMYp13cdacDU',
                publicKeyBase58: 'DX4KedQtt8aDJxekZx9kQxwdjTa6nqLtWBNb4NdDCGGq',
            },
        ],
    },
};
const MOCK_RESOLVER_REGISTRY = {
    key: () => Promise.resolve(MOCK_RESOLVER_RESULT),
};
const defaultOptions = { provider: { send: jest.fn() } };
test('`authenticated` property', () => {
    const did = new did_1.DID(defaultOptions);
    expect(did.authenticated).toBe(false);
});
test('`id` property', () => {
    const did = new did_1.DID(defaultOptions);
    expect(() => did.id).toThrow('DID is not authenticated');
});
test('RPC calls throw an error if the response payload is an error', () => __awaiter(void 0, void 0, void 0, function* () {
    const provider1 = {
        send: jest.fn((req) => {
            return Promise.resolve({
                jsonrpc: '2.0',
                id: req.id,
                error: { code: 401, message: 'Unauthorized' },
            });
        }),
    };
    const did1 = new did_1.DID({ provider: provider1 });
    yield expect(() => did1.authenticate()).rejects.toThrow('Unauthorized');
    const provider2 = {
        send: jest.fn((req) => {
            return Promise.resolve({
                jsonrpc: '2.0',
                id: req.id,
                error: { code: 401 },
            });
        }),
    };
    const did2 = new did_1.DID({ provider: provider2 });
    yield expect(() => did2.authenticate()).rejects.toThrow('Application error');
}));
test('`setProvider` method', () => {
    const provider1 = {};
    const provider2 = {};
    const did = new did_1.DID();
    expect(did._client).not.toBeDefined();
    did.setProvider(provider1);
    expect(did._client.connection).toBe(provider1);
    const client = did._client;
    did.setProvider(provider1);
    expect(did._client).toBe(client);
    expect(() => did.setProvider(provider2)).toThrow('A different provider is already set');
});
describe('`authenticate` method', () => {
    test('uses the provider attached to the instance', () => __awaiter(void 0, void 0, void 0, function* () {
        const provider = {
            send: jest.fn((req) => {
                return Promise.resolve({
                    jsonrpc: '2.0',
                    id: req.id,
                    result: MOCK_AUTH_JWS,
                });
            }),
        };
        const did = new did_1.DID({ provider, resolver: MOCK_RESOLVER_REGISTRY });
        yield did.authenticate();
        expect(provider.send).toHaveBeenCalledTimes(1);
        expect(provider.send).toHaveBeenCalledWith({
            jsonrpc: '2.0',
            id: expect.any(String),
            method: 'did_authenticate',
            params: {
                aud: undefined,
                nonce: MOCK_NONCE,
                paths: [],
            },
        });
        expect(did.authenticated).toBe(true);
        expect(did.id).toBe(MOCK_DID);
    }));
    test('uses the provider given in options', () => __awaiter(void 0, void 0, void 0, function* () {
        const provider = {
            send: jest.fn((req) => {
                return Promise.resolve({
                    jsonrpc: '2.0',
                    id: req.id,
                    result: MOCK_AUTH_JWS,
                });
            }),
        };
        const did = new did_1.DID({ resolver: MOCK_RESOLVER_REGISTRY });
        yield did.authenticate({ provider });
        expect(provider.send).toHaveBeenCalledTimes(1);
        expect(provider.send).toHaveBeenCalledWith({
            jsonrpc: '2.0',
            id: expect.any(String),
            method: 'did_authenticate',
            params: {
                aud: undefined,
                nonce: MOCK_NONCE,
                paths: [],
            },
        });
        expect(did.authenticated).toBe(true);
        expect(did.id).toBe(MOCK_DID);
    }));
    test('throws an error if there is no provider', () => __awaiter(void 0, void 0, void 0, function* () {
        const did = new did_1.DID();
        yield expect(did.authenticate()).rejects.toThrow('No provider available');
    }));
});
describe('`createJWS` method', () => {
    test('uses the provider attached to the instance', () => __awaiter(void 0, void 0, void 0, function* () {
        let authCalled = false;
        const provider = {
            send: jest.fn((req) => {
                let result;
                if (authCalled) {
                    result = { jws: '5678' };
                }
                else {
                    authCalled = true;
                    result = MOCK_AUTH_JWS;
                }
                return Promise.resolve({
                    jsonrpc: '2.0',
                    id: req.id,
                    result,
                });
            }),
        };
        const did = new did_1.DID({ provider, resolver: MOCK_RESOLVER_REGISTRY });
        yield expect(did.createJWS({})).rejects.toThrow('DID is not authenticated');
        yield did.authenticate();
        const data = {
            foo: 'bar',
        };
        const jws = yield did.createJWS(data);
        expect(jws).toBe('5678');
        expect(provider.send).toHaveBeenCalledTimes(2);
        expect(provider.send.mock.calls[1][0]).toEqual({
            jsonrpc: '2.0',
            id: expect.any(String),
            method: 'did_createJWS',
            params: {
                did: MOCK_DID,
                payload: {
                    foo: 'bar',
                },
            },
        });
    }));
    test('throws an error if there is no provider', () => __awaiter(void 0, void 0, void 0, function* () {
        const did = new did_1.DID();
        yield expect(did.createJWS({})).rejects.toThrow('No provider available');
    }));
});
describe('`createDagJWS method`', () => {
    test('throws an error if there is no provider', () => __awaiter(void 0, void 0, void 0, function* () {
        const did = new did_1.DID();
        yield expect(did.createJWS({})).rejects.toThrow('No provider available');
    }));
    test('creates a DagJWS correctly', () => __awaiter(void 0, void 0, void 0, function* () {
        let authCalled = false;
        const provider = {
            send: jest.fn((req) => {
                let result;
                if (authCalled) {
                    result = {
                        jws: { payload: '234', signatures: [{ protected: '5678', signature: '4324' }] },
                    };
                }
                else {
                    authCalled = true;
                    result = MOCK_AUTH_JWS;
                }
                return Promise.resolve({
                    jsonrpc: '2.0',
                    id: req.id,
                    result,
                });
            }),
        };
        const did = new did_1.DID({ provider, resolver: MOCK_RESOLVER_REGISTRY });
        yield expect(did.createDagJWS({})).rejects.toThrow('DID is not authenticated');
        yield did.authenticate();
        const data = {
            foo: Buffer.from('foo'),
        };
        const res = yield did.createDagJWS(data);
        const encPayload = yield dag_jose_utils_1.encodePayload(data);
        expect(res).toEqual({
            jws: {
                link: encPayload.cid,
                payload: '234',
                signatures: [{ protected: '5678', signature: '4324' }],
            },
            linkedBlock: encPayload.linkedBlock,
        });
        expect(provider.send.mock.calls[1][0]).toEqual({
            jsonrpc: '2.0',
            id: expect.any(String),
            method: 'did_createJWS',
            params: {
                did: MOCK_DID,
                payload: encodeBase64Url(encPayload.cid.bytes),
                linkedBlock: encodeBase64(encPayload.linkedBlock),
            },
        });
    }));
});
describe('`verifyJWS method`', () => {
    const THREE_ID_RESOLVER_RESULT = {
        didResolutionMetadata: {},
        didDocumentMetadata: {},
        didDocument: {
            '@context': 'https://w3id.org/did/v1',
            id: 'did:3:bagcqceraskxqzx47ivokjqofwoyuyb23tiaepdrazq5rlzn2hx7kmyaczwoa',
            verificationMethod: [
                {
                    controller: 'did:3:bagcqceraskxqzx47ivokjqofwoyuyb23tiaepdrazq5rlzn2hx7kmyaczwoa',
                    id: 'did:3:bagcqceraskxqzx47ivokjqofwoyuyb23tiaepdrazq5rlzn2hx7kmyaczwoa#7Xd9rh1vWBaxQsF',
                    publicKeyHex: '0368e92e4d7284f4f0414f023019fe19532b7da0115edeed2fe183199d79a78b7e',
                    type: 'Secp256k1VerificationKey2018',
                },
            ],
            authentication: [
                {
                    controller: 'did:3:bagcqceraskxqzx47ivokjqofwoyuyb23tiaepdrazq5rlzn2hx7kmyaczwoa',
                    id: 'did:3:bagcqceraskxqzx47ivokjqofwoyuyb23tiaepdrazq5rlzn2hx7kmyaczwoa#7Xd9rh1vWBaxQsF',
                    publicKeyHex: '0368e92e4d7284f4f0414f023019fe19532b7da0115edeed2fe183199d79a78b7e',
                    type: 'Secp256k1VerificationKey2018',
                },
            ],
        },
    };
    const resolverRegistry = Object.assign(Object.assign({}, MOCK_RESOLVER_REGISTRY), { '3': () => Promise.resolve(THREE_ID_RESOLVER_RESULT) });
    test('correctly verifies jws string', () => __awaiter(void 0, void 0, void 0, function* () {
        const did = new did_1.DID({ resolver: resolverRegistry });
        const jws = 'eyJraWQiOiJkaWQ6MzpiYWdjcWNlcmFza3hxeng0N2l2b2tqcW9md295dXliMjN0aWFlcGRyYXpxNXJsem4yaHg3a215YWN6d29hP3ZlcnNpb24taWQ9MCNrV01YTU1xazVXc290UW0iLCJhbGciOiJFUzI1NksifQ.AXESIHhRlyKdyLsRUpRdpY4jSPfiee7e0GzCynNtDoeYWLUB.h7bHmTaBGza_QlFRI9LBfgB3Nw0m7hLzwMm4nLvcR3n9sHKRoCrY0soWnDbmuG7jfVgx4rYkjJohDuMNgbTpEQ';
        expect(yield did.verifyJWS(jws)).toEqual({
            didResolutionResult: THREE_ID_RESOLVER_RESULT,
            kid: 'did:3:bagcqceraskxqzx47ivokjqofwoyuyb23tiaepdrazq5rlzn2hx7kmyaczwoa?version-id=0#kWMXMMqk5WsotQm',
        });
    }));
    test('correctly verifies DagJWS', () => __awaiter(void 0, void 0, void 0, function* () {
        const did = new did_1.DID({ resolver: resolverRegistry });
        const jws = {
            payload: 'AXESIHhRlyKdyLsRUpRdpY4jSPfiee7e0GzCynNtDoeYWLUB',
            signatures: [
                {
                    protected: 'eyJraWQiOiJkaWQ6MzpiYWdjcWNlcmFza3hxeng0N2l2b2tqcW9md295dXliMjN0aWFlcGRyYXpxNXJsem4yaHg3a215YWN6d29hP3ZlcnNpb24taWQ9MCNrV01YTU1xazVXc290UW0iLCJhbGciOiJFUzI1NksifQ',
                    signature: 'h7bHmTaBGza_QlFRI9LBfgB3Nw0m7hLzwMm4nLvcR3n9sHKRoCrY0soWnDbmuG7jfVgx4rYkjJohDuMNgbTpEQ',
                },
            ],
        };
        expect(yield did.verifyJWS(jws)).toEqual({
            didResolutionResult: THREE_ID_RESOLVER_RESULT,
            kid: 'did:3:bagcqceraskxqzx47ivokjqofwoyuyb23tiaepdrazq5rlzn2hx7kmyaczwoa?version-id=0#kWMXMMqk5WsotQm',
        });
    }));
    test('correctly verifies jws auth JWS', () => __awaiter(void 0, void 0, void 0, function* () {
        const did = new did_1.DID({ resolver: resolverRegistry });
        expect(yield did.verifyJWS(MOCK_AUTH_JWS)).toEqual({
            didResolutionResult: MOCK_RESOLVER_RESULT,
            kid: 'did:key:z6MkoCHYXLHAWHPPVMBSe9nQcteTmnY32GdBQMYp13cdacDU#z6MkoCHYXLHAWHPPVMBSe9nQcteTmnY32GdBQMYp13cdacDU',
            payload: {
                did: 'did:key:z6MkoCHYXLHAWHPPVMBSe9nQcteTmnY32GdBQMYp13cdacDU',
                exp: 1606236374,
                nonce: 'rWCXyH1otp5/F78tycckgg',
            },
        });
    }));
});
const createRegistry = (didMap) => ({
    test: (did) => __awaiter(void 0, void 0, void 0, function* () {
        const pk = x25519_1.generateKeyPairFromSeed(didMap[did]).publicKey;
        return {
            didResolutionMetadata: {},
            didDocumentMetadata: {},
            didDocument: {
                keyAgreement: [
                    {
                        id: u8a.toString(pk, 'base58btc'),
                        type: 'X25519KeyAgreementKey2019',
                        publicKeyBase58: u8a.toString(pk, 'base58btc'),
                    },
                ],
            },
        };
    }),
});
describe('`createJWE method`', () => {
    beforeAll(() => {
        jest.resetAllMocks();
    });
    test('correctly encrypts, one recipient', () => __awaiter(void 0, void 0, void 0, function* () {
        const recipient = 'did:test:asdf';
        const secretKey = random_1.randomBytes(32);
        const registry = createRegistry({ [recipient]: secretKey });
        const did = new did_1.DID({ resolver: registry });
        const cleartext = u8a.fromString('such secret');
        const jwe = yield did.createJWE(cleartext, [recipient]);
        const decrypter = did_jwt_1.x25519Decrypter(secretKey);
        expect(yield did_jwt_1.decryptJWE(jwe, decrypter)).toEqual(cleartext);
    }));
    test('correctly encrypts, two recipients', () => __awaiter(void 0, void 0, void 0, function* () {
        const recipient1 = 'did:test:asdf';
        const secretKey1 = random_1.randomBytes(32);
        const recipient2 = 'did:test:lalal';
        const secretKey2 = random_1.randomBytes(32);
        const registry = createRegistry({ [recipient1]: secretKey1, [recipient2]: secretKey2 });
        const did = new did_1.DID({ resolver: registry });
        const cleartext = u8a.fromString('such secret');
        const jwe = yield did.createJWE(cleartext, [recipient1, recipient2]);
        const decrypter1 = did_jwt_1.x25519Decrypter(secretKey1);
        const decrypter2 = did_jwt_1.x25519Decrypter(secretKey2);
        expect(yield did_jwt_1.decryptJWE(jwe, decrypter1)).toEqual(cleartext);
        expect(yield did_jwt_1.decryptJWE(jwe, decrypter2)).toEqual(cleartext);
    }));
});
describe('`createDagJWE method`', () => {
    test('correctly formats dagJWE cleartext', () => __awaiter(void 0, void 0, void 0, function* () {
        const recipient = 'did:test:asdf';
        const secretKey = random_1.randomBytes(32);
        const registry = createRegistry({ [recipient]: secretKey });
        const did = new did_1.DID({ resolver: registry });
        const cleartext = { very: 'cool', dag: 'object' };
        const jwe = yield did.createDagJWE(cleartext, [recipient]);
        const decrypter = did_jwt_1.x25519Decrypter(secretKey);
        const data = yield did_jwt_1.decryptJWE(jwe, decrypter);
        expect(dag_jose_utils_1.decodeCleartext(data)).toEqual(cleartext);
    }));
});
describe('`decryptJWE method`', () => {
    test('throws an error if there is no provider', () => __awaiter(void 0, void 0, void 0, function* () {
        const did = new did_1.DID();
        yield expect(did.createJWS({})).rejects.toThrow('No provider available');
    }));
    test('uses the provider attached to the instance', () => __awaiter(void 0, void 0, void 0, function* () {
        const provider = {
            send: jest.fn((req) => {
                return Promise.resolve({
                    jsonrpc: '2.0',
                    id: req.id,
                    result: { cleartext: u8a.toString(u8a.fromString('abcde'), 'base64pad') },
                });
            }),
        };
        const did = new did_1.DID({ provider });
        did._id = 'did:3:1234';
        const jwe = { foo: 'bar' };
        const cleartext = yield did.decryptJWE(jwe);
        expect(cleartext).toEqual(u8a.fromString('abcde'));
        expect(provider.send).toHaveBeenCalledTimes(1);
        expect(provider.send.mock.calls[0][0]).toEqual({
            jsonrpc: '2.0',
            id: expect.any(String),
            method: 'did_decryptJWE',
            params: {
                did: 'did:3:1234',
                jwe,
            },
        });
    }));
});
describe('`decryptDagJWE` method', () => {
    test('throws an error if there is no provider', () => __awaiter(void 0, void 0, void 0, function* () {
        const did = new did_1.DID();
        yield expect(did.createJWS({})).rejects.toThrow('No provider available');
    }));
    test('uses the provider attached to the instance', () => __awaiter(void 0, void 0, void 0, function* () {
        const clearObj = { asdf: 432 };
        const cleartext = encodeBase64(dag_jose_utils_1.prepareCleartext(clearObj));
        const provider = {
            send: jest.fn((req) => {
                return Promise.resolve({
                    jsonrpc: '2.0',
                    id: req.id,
                    result: { cleartext },
                });
            }),
        };
        const did = new did_1.DID({ provider });
        did._id = 'did:3:1234';
        const jwe = { foo: 'bar' };
        const decrypted = yield did.decryptDagJWE(jwe);
        expect(decrypted).toEqual(clearObj);
        expect(provider.send).toHaveBeenCalledTimes(1);
        expect(provider.send.mock.calls[0][0]).toEqual({
            jsonrpc: '2.0',
            id: expect.any(String),
            method: 'did_decryptJWE',
            params: {
                did: 'did:3:1234',
                jwe,
            },
        });
    }));
});
//# sourceMappingURL=provider-behavior.test.js.map