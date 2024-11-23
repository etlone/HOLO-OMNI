import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card, Button, Avatar, Icon, Input } from 'react-native-elements';

interface Post {
  id: number;
  user: {
    name: string;
    avatar: string;
  };
  content: string;
  likes: number;
  comments: number;
  timestamp: Date;
  liked: boolean;
}

const mockPosts: Post[] = [
  {
    id: 1,
    user: {
      name: 'Sarah Johnson',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    },
    content: 'Just completed my first 10K run! 🏃‍♀️ Feeling amazing and grateful for this community's support!',
    likes: 24,
    comments: 5,
    timestamp: new Date(),
    liked: false,
  },
  {
    id: 2,
    user: {
      name: 'Mike Chen',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
    content: 'Today's meditation session was exactly what I needed. Remember to take care of your mental health! 🧘‍♂️',
    likes: 18,
    comments: 3,
    timestamp: new Date(Date.now() - 3600000),
    liked: false,
  },
];

interface Challenge {
  id: number;
  title: string;
  description: string;
  participants: number;
  daysLeft: number;
  joined: boolean;
}

const mockChallenges: Challenge[] = [
  {
    id: 1,
    title: '30-Day Meditation',
    description: 'Meditate for 10 minutes daily',
    participants: 156,
    daysLeft: 22,
    joined: false,
  },
  {
    id: 2,
    title: '10K Steps Daily',
    description: 'Walk 10,000 steps every day',
    participants: 342,
    daysLeft: 15,
    joined: false,
  },
];

export default function CommunityScreen() {
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [challenges, setChallenges] = useState<Challenge[]>(mockChallenges);
  const [newPost, setNewPost] = useState('');

  const toggleLike = (postId: number) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.liked ? post.likes - 1 : post.likes + 1,
          liked: !post.liked,
        };
      }
      return post;
    }));
  };

  const joinChallenge = (challengeId: number) => {
    setChallenges(challenges.map(challenge => {
      if (challenge.id === challengeId) {
        return {
          ...challenge,
          participants: challenge.joined ? challenge.participants - 1 : challenge.participants + 1,
          joined: !challenge.joined,
        };
      }
      return challenge;
    }));
  };

  const addPost = () => {
    if (!newPost.trim()) return;
    
    const post: Post = {
      id: posts.length + 1,
      user: {
        name: 'You',
        avatar: 'https://randomuser.me/api/portraits/lego/1.jpg',
      },
      content: newPost,
      likes: 0,
      comments: 0,
      timestamp: new Date(),
      liked: false,
    };

    setPosts([post, ...posts]);
    setNewPost('');
  };

  return (
    <ScrollView style={styles.container}>
      <Card containerStyle={styles.challengesCard}>
        <Card.Title>Active Challenges</Card.Title>
        {challenges.map(challenge => (
          <View key={challenge.id} style={styles.challengeItem}>
            <View style={styles.challengeInfo}>
              <Text style={styles.challengeTitle}>{challenge.title}</Text>
              <Text style={styles.challengeDescription}>{challenge.description}</Text>
              <Text style={styles.challengeStats}>
                {challenge.participants} participants • {challenge.daysLeft} days left
              </Text>
            </View>
            <Button
              title={challenge.joined ? 'Leave' : 'Join'}
              type={challenge.joined ? 'outline' : 'solid'}
              onPress={() => joinChallenge(challenge.id)}
              buttonStyle={styles.joinButton}
            />
          </View>
        ))}
      </Card>

      <Card containerStyle={styles.newPostCard}>
        <Input
          placeholder="Share your wellness journey..."
          value={newPost}
          onChangeText={setNewPost}
          multiline
          containerStyle={styles.newPostInput}
        />
        <Button
          title="Post"
          onPress={addPost}
          disabled={!newPost.trim()}
        />
      </Card>

      {posts.map(post => (
        <Card key={post.id} containerStyle={styles.postCard}>
          <View style={styles.postHeader}>
            <View style={styles.userInfo}>
              <Avatar
                rounded
                source={{ uri: post.user.avatar }}
                size="medium"
              />
              <View style={styles.nameTimeContainer}>
                <Text style={styles.userName}>{post.user.name}</Text>
                <Text style={styles.timestamp}>
                  {post.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
            </View>
          </View>
          
          <Text style={styles.postContent}>{post.content}</Text>
          
          <View style={styles.postActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => toggleLike(post.id)}
            >
              <Icon
                name={post.liked ? 'heart' : 'heart-outline'}
                type="material-community"
                color={post.liked ? '#e91e63' : '#666'}
              />
              <Text style={styles.actionText}>{post.likes}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Icon
                name="comment-outline"
                type="material-community"
                color="#666"
              />
              <Text style={styles.actionText}>{post.comments}</Text>
            </TouchableOpacity>
          </View>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  challengesCard: {
    marginBottom: 10,
  },
  challengeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  challengeInfo: {
    flex: 1,
    marginRight: 10,
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  challengeDescription: {
    color: '#666',
    marginVertical: 4,
  },
  challengeStats: {
    fontSize: 12,
    color: '#888',
  },
  joinButton: {
    paddingHorizontal: 20,
  },
  newPostCard: {
    marginBottom: 10,
  },
  newPostInput: {
    marginBottom: 10,
  },
  postCard: {
    marginBottom: 10,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameTimeContainer: {
    marginLeft: 10,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  timestamp: {
    color: '#666',
    fontSize: 12,
  },
  postContent: {
    fontSize: 16,
    marginBottom: 10,
  },
  postActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  actionText: {
    marginLeft: 5,
    color: '#666',
  },
});
