import { PutEventsCommand } from '@aws-sdk/client-eventbridge';

import { eventBridgeClient } from '@/lib/aws';

export async function publishEvent({
  eventType,
  payload,
  source = 'client-service',
  eventBusName = 'ServiceEventBus',
}: {
  eventType: string;
  payload: any;
  source?: string;
  eventBusName?: string;
}) {
  const command = new PutEventsCommand({
    Entries: [
      {
        Source: source,
        DetailType: eventType,
        Detail: JSON.stringify(payload),
        EventBusName: eventBusName,
      },
    ],
  });

  const response = await eventBridgeClient.send(command);
  return response;
}
