import { readFileSync } from 'fs';

const LITERAL = 4;

const hexToBin = hex => [...hex].reduce((prev, hc) => `${prev}${parseInt(hc, 16).toString(2).padStart(4, '0')}`, '');

class Packet {
    constructor(binary) {
        this.remainingBinary = binary;

        this.version = this.take(3, true);
        this.typeId = this.take(3, true);
        this.lengthTypeId = null;
        this.literalValue = null;
        this.subPackets = [];

        if (this.isLiteral === true) {
            let binaryLiteral = '';
            let segmentEnd = false;

            while (segmentEnd === false) {
                const chunk = this.take(5);
                binaryLiteral += chunk.substring(1);

                segmentEnd = chunk[0] === '0';
            }

            this.literalValue = parseInt(binaryLiteral, 2);

            if (this.remainingBinary.length > 0 && this.remainingBinary.replace(/0/g, '') !== '') {
                this.subPackets.push(new Packet(this.remainingBinary));
            }
        }
        else {
            this.lengthTypeId = this.take(1);

            if (this.lengthTypeId === '0') {
                const subPacketLength = this.take(15, true);
                const subPacketsBinary = this.take(subPacketLength);
                this.subPackets.push(new Packet(subPacketsBinary));
                if (this.remainingBinary.length > 0 && this.remainingBinary.replace(/0/g, '') !== '') {
                    this.subPackets.push(new Packet(this.remainingBinary));
                }
            }
            else if (this.lengthTypeId === '1') {
                /* const subPacketCount = */ this.take(11, true); // we don't actually care how many sub-packets there are at this point
                this.subPackets.push(new Packet(this.remainingBinary));
            }
        }
    }

    get isLiteral() {
        return this.typeId === LITERAL;
    }

    take(length, convertToDecimal = false) {
        const result = this.remainingBinary.substring(0, length);
        this.remainingBinary = this.remainingBinary.substring(length);
        return convertToDecimal ? parseInt(result, 2) : result;
    }
}

const input = readFileSync('input', 'utf-8');
// const input = 'D2FE28';
// const input = '38006F45291200';
// const input = '8A004A801A8002F478';
// const input = '620080001611562C8802118E34';
// const input = 'C0015000016115A2E0802F182340';

const sumPackets = packets => (packets && packets.length > 0 ? packets.reduce((sum, sp) => sum + sp.version + sumPackets(sp.subPackets), 0) : 0);

const binary = hexToBin(input);
const packet = new Packet(binary);
console.log(packet);
console.log(packet.version + sumPackets(packet.subPackets));
