import { Input } from '@components/input/input';
import { Tweet } from '@components/Post/tweet';
import type { TweetProps } from '@components/Post/tweet';

type TweetReplyModalProps = {
  tweet: TweetProps;
  closeModal: () => void;
};

export function TweetReplyModal({
  tweet,
  closeModal
}: TweetReplyModalProps): JSX.Element {
  return (
    <Input
      modal
      replyModal
      parent={{ id: tweet.id, username: tweet.user.username }}
      closeModal={closeModal}
    >
      <Tweet modal parentTweet {...tweet} />
    </Input>
  );
}
