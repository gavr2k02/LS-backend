import Pubnub from 'pubnub';

const pubnub = new Pubnub({
  publishKey: 'pub-c-1f2ce736-ed6a-40ec-a0e1-808832fe3807',
  subscribeKey: 'sub-c-853c8ce2-095a-11ec-8f04-0664d1b72b66',
});

export async function publish<T>(channel: string, message: T) {
  pubnub.publish({ channel, message });
}
