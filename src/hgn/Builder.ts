import { Analyser } from 'src/hgn/Analyser';
import type { HGN, Metadata, Turn } from 'src/hgn/types';

export class Builder {
    private hgn: HGN = {
        metadata: {},
        turns: [],
    };

    public setMetadata(metadata: Partial<Metadata>): this {
        this.hgn.metadata = { ...metadata };
        return this;
    }

    public addMetadataAttribute<K extends keyof Metadata>(key: K, value: Metadata[K]): this {
        this.hgn.metadata[key] = value;
        return this;
    }

    public addTurn(turn: Turn): this {
        this.hgn.turns.push(turn);
        return this;
    }

    public build(analyse = true): HGN {
        if (analyse) {
            const analyser = new Analyser(this.hgn);
            analyser.analyse();
        }

        return this.hgn;
    }
}
