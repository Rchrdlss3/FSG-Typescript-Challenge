type ProviderEvent = {

messageId?: string;

type?: string; // not guaranteed to be normalized

recipient?: string;

ts?: number; // epoch ms; may be missing

};

 

type CleanEvent = {

messageId: string;

type: string;

recipient: string;

ts: number;

};

 

function cleanStr(v?: string): string {

const t = (v ?? "").trim();

return t.length ? t : "unknown";

}

 

function cleanType(v?: string): string {

const t = (v ?? "").trim().toLowerCase();

return t.length ? t : "unknown";

}

 

function cleanTs(v?: number): number {

return Number.isFinite(v) ? (v as number) : Date.now();

}

export function dedupeEvents(events: ProviderEvent[]): CleanEvent[] {

const recipientMap = new Map();

for (let i = 0; i < events.length; i++) {

    const currentEvent = events[i];

    currentEvent.messageId = cleanStr(currentEvent.messageId)

    currentEvent.type = cleanType(currentEvent.type)

    currentEvent.recipient = cleanStr(currentEvent.messageId)    

    currentEvent.ts = cleanTs(currentEvent.ts)

    const recipientKey = `${currentEvent.messageId}:${currentEvent.type}:${currentEvent.recipient}`

   if (recipientMap.has(recipientKey)) {

   const prevOcurrence = recipientMap.get(recipientKey)

    if (currentEvent.ts < prevOcurrence.ts) {

       recipientMap[recipientKey] = currentEvent

    } 

    } else {

   recipientMap.set(recipientKey,currentEvent) 

    }    

}

return Object.values(recipientMap).sort((a,b) => b.ts - a.ts)

}
