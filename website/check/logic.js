const authAvailable = PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();

function start() {
    if(!authAvailable) {
        console.log("Auth not available");
        return;
    }

    document.getElementById("create")
        .addEventListener('click', createauth);

    document.getElementById("login")
        .addEventListener('click', loginauth);
    
}

function createauth() {
    console.log("ase");
    let userIdBuffer = new Uint8Array(16);
    let challengeBuffer = new Uint8Array([
        0x8C, 0x0A, 0x26, 0xFF, 0x22, 0x91, 0xC1, 0xE9, 0xB9, 0x4E, 0x2E, 0x17, 0x1A, 0x98, 0x6A, 0x73,
        0x71, 0x9D, 0x43, 0x48, 0xD5, 0xA7, 0x6A, 0x15, 0x7E, 0x38, 0x94, 0x52, 0x77, 0x97, 0x0F, 0xEF
    ]).buffer;

    let options = {
        publicKey: {
            rp: { name: "example.com" },
            user: {
                name: "john@example.com",
                id: userIdBuffer,
                displayName: "John"
            },
            pubKeyCredParams: [ { type: "public-key", alg: -7 } ],
            challenge: challengeBuffer,
            authenticationSelection: { authenticatorAttachment: "plataform" },
            attestation: "direct"
        }
    };

    var publicKeyCredential = navigator.credentials.create(options);
}

function loginauth() {
    let options = {
        publicKey: {
            challenge: challengeBuffer,
            allowCredentials: [{
                type: "public-key",
                id: credentialIdBuffer,
                transports: ["internal"]
            }]
        }
    };

    var publicKeyCredential = navigator.credentials.get(options);
}