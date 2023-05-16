export type AnchorCounterProgram = {
  "version": "0.1.0",
  "name": "anchor_counter_program",
  "instructions": [
    {
      "name": "initializeOrGreet",
      "accounts": [
        {
          "name": "greetingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "greetingAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "counter",
            "type": "u64"
          }
        ]
      }
    }
  ]
};

export const IDL: AnchorCounterProgram = {
  "version": "0.1.0",
  "name": "anchor_counter_program",
  "instructions": [
    {
      "name": "initializeOrGreet",
      "accounts": [
        {
          "name": "greetingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "greetingAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "counter",
            "type": "u64"
          }
        ]
      }
    }
  ]
};
