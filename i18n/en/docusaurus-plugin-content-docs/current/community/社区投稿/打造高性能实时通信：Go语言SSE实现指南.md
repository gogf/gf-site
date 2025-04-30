---
slug: "/articles/go-sse-implementation-guide"
title: "Building High-Performance Real-Time Communication: Go Language SSE Implementation Guide"
hide_title: true
keywords: ["Go", "SSE", "Server-Sent Events", "real-time communication", "AI streaming output", "distributed messaging", "Redis publish/subscribe", "client push", "real-time data updates", "concurrent processing"]
description: "This article reveals best practices for implementing high-performance real-time communication in Go, providing a detailed analysis of Server-Sent Events (SSE) technology principles, application scenarios, and AI field implementations. From basic implementation to distributed architecture, it comprehensively covers single-client message sending, broadcast messaging, Redis integration, and multi-goroutine concurrent processing, complete with code examples and performance optimization strategies."
---


![](/markdown/go-sse-banner.webp)


## 1. What is SSE?

`SSE (Server-Sent Events)` is a server push technology that allows servers to send real-time updates to clients via `HTTP` connections. Unlike `WebSocket`, `SSE` is a unidirectional communication mechanism - only the server can push data to the client, with no support for clients sending data back to the server.

The main features of `SSE` include:

1. **Based on the `HTTP` protocol**: No special protocol support required, uses standard `HTTP` connections
2. **Automatic reconnection**: Browsers have built-in support for reconnection mechanisms
3. **Event IDs and types**: Supports message IDs and event types for easier client-side handling of different event types
4. **Plain text transmission**: Uses `UTF-8` encoded text data
5. **One-way communication**: Only servers can push data to clients

The `SSE` data format is very simple. Each message consists of one or more fields, with each field composed of a field name, colon, and field value, separated by line breaks:

```javascript
field: value\n
```

A complete `SSE` message example:

```javascript
id: 1\n
event: update\n
data: {"message": "Hello, World!"}\n\n
```

The double line break (`\n\n`) indicates the end of a message.

## 2. SSE Application Scenarios

`SSE` is particularly suitable for the following business scenarios:

### 2.1 Real-time Data Updates

- **Stock market information**: Push the latest stock prices, trading volumes, and other information to users in real-time
- **Sports score broadcasting**: Real-time updates of game scores, match status, and other information
- **Social media feeds**: Push notifications for the latest activities, comments, likes, etc.

### 2.2 System Monitoring and Alerts

- **Server monitoring**: Real-time push of CPU usage, memory occupation, network traffic, and other monitoring metrics
- **Application performance monitoring**: Push application response time, error rate, and other performance indicators
- **Alert notifications**: Immediately push alert information when system anomalies occur

### 2.3 Collaboration Tools

- **Document collaboration**: Real-time display of other users' editing operations
- **Project management tools**: Push task status changes, new comments, and other updates
- **Chat applications**: Push new message notifications

### 2.4 Progress Feedback

- **File upload/download**: Real-time display of upload/download progress
- **Long-running tasks**: Push task execution progress and stage completion status
- **Data processing workflows**: Display the various stages and progress of data processing


## 3. SSE Applications in AI

`SSE` has widespread applications in the `AI` field, especially in scenarios requiring streaming output of `AI`-generated content:

### 3.1 Large Language Model Streaming Responses

When users ask questions to large language models like `ChatGPT` or `DeepSeek`, the models typically need some time to generate complete answers. Using `SSE` enables:

- **Character-by-character output**: The model returns each word as soon as it's generated, rather than waiting for the entire answer to be completed
- **Thought process visualization**: Allows users to see the "thinking" process of the `AI`, enhancing the interactive experience
- **Early termination**: Users can decide whether to terminate the generation process after seeing part of the answer

This approach greatly improves the user experience, reduces waiting time, and gives the impression that the `AI` is thinking and responding in real-time.

### 3.2 AI Image Generation Process

In AI image generation scenarios, `SSE` can be used for:

- **Progressive rendering**: Showing the image generation process from blurry to clear
- **Intermediate result display**: Showing image results at different iteration steps
- **Generation parameter feedback**: Real-time feedback on parameters and processing status used by the model

### 3.3 Speech Recognition and Real-time Translation

In speech recognition and real-time translation scenarios:

- **Streaming speech-to-text**: Text appears in real-time as the user speaks
- **Real-time translation**: Translation results are generated in real-time as the source language is recognized
- **Confidence feedback**: Display confidence levels of recognition or translation results, updating when better results are available

### 3.4 AI-assisted Programming

In AI programming assistants like `GitHub Copilot`:

- **Code completion suggestions**: Provide code completion suggestions in real-time, rather than waiting for complete code blocks to be generated
- **Multiple solution display**: Stream multiple possible code implementation solutions simultaneously
- **Explanations and documentation**: Generate code explanations and documentation in real-time

## 4. Implementing SSE with Go

![](/markdown/go-sse.webp)

Implementing an `SSE` service with `Go` is very straightforward. Below, we'll detail how to implement an `SSE` service using the `GoFrame` framework.



### 4.1 Basic SSE Implementation

First, we need to create a basic `SSE` handler, set the correct `HTTP` headers, and keep the connection open:

```go
// SseHandler Basic SSE handler
func SseHandler(r *ghttp.Request) {
    // Set necessary HTTP headers for SSE
    r.Response.Header().Set("Content-Type", "text/event-stream")
    r.Response.Header().Set("Cache-Control", "no-cache")
    r.Response.Header().Set("Connection", "keep-alive")
    r.Response.Header().Set("Access-Control-Allow-Origin", "*")

    // Simulate sending some messages
    for i := 1; i <= 5; i++ {
        // Send message
        r.Response.Writefln("data: %d", i)
        r.Response.Writefln("id: %d", i)
        r.Response.Writefln("event: message\n")
        r.Response.Writefln("data: {\"message\": \"Hello SSE %d\"}\n", i)
        // Immediately flush to client
        r.Response.Flush() 
        
        // Simulate processing time
        time.Sleep(1 * time.Second)
    }
}
```
> The `r.Response.Writefln` method is used to format and write data to the `HTTP` response, adding a newline character at the end of the written content.

Then register this handler in the router:

```go
s := g.Server()
s.Group("/", func(group *ghttp.RouterGroup) {
    group.GET("/sse", SseHandler)
})
```

Clients can use the browser's native `EventSource API` to connect to this endpoint:

```javascript
// Client code
const eventSource = new EventSource('/sse');

// Listen for message events
eventSource.addEventListener('message', function(e) {
  const data = JSON.parse(e.data);
  console.log('Received message:', data.message);
});

// Listen for connection open event
eventSource.onopen = function() {
  console.log('Connection to server opened.');
};

// Listen for errors
eventSource.onerror = function(e) {
  console.error('EventSource failed:', e);
};

// Close connection
eventSource.close();
```


### 4.2 Implementing a More Flexible SSE Service

To better manage `SSE` connections and message sending, we can implement a more complete `SSE` service.

#### 4.2.1 Common SSE Business Scenarios

In practical applications, in addition to streaming output from a single client request (such as a brief `AI Chat` response), we typically need to implement two message sending modes:
- Sending messages to a specific client (`SendToClient`)
- Broadcasting messages to all clients (`BroadcastMessage`)

##### 4.2.1.1 Scenarios for Sending Messages to Specific Clients

1. **Personalized Notifications**
   - User-specific reminders (such as bill due dates, appointment reminders)
   - System messages for specific users (such as account status changes)

2. **Streaming Responses in AI Applications**
   - AI chat applications need to stream generated content in real-time to the specific user who initiated the request
   - Progress and results of long-running tasks such as document generation and code completion

3. **Asynchronous Task Completion Notifications**
   - Notifying the task initiator when a long-running background task (such as file processing, data import) is completed
   - Order status change notifications to the ordering user

##### 4.2.1.2 Broadcast Message Scenarios

1. **System Announcements**
   - System maintenance notifications
   - Global feature update announcements
   - Emergency event notifications

2. **Real-time Data Updates**
   - Stock and cryptocurrency price changes
   - Sports match score updates
   - Weather alert information

3. **Multi-user Collaboration Environments**
   - Shared board or dashboard data updates
   - New message notifications in team chats

All these scenarios can be supported through the `SendToClient` and `BroadcastMessage` methods we're about to implement.

#### 4.2.2 Implementing the `SSE` Service

```go
// internal/logic/sse/sse.go

// Client represents an SSE client connection
type Client struct {
    Id          string
    Request     *ghttp.Request
    messageChan chan string
}

// Service SSE service
type Service struct {
    clients *gmap.StrAnyMap  // Stores all client connections
}

// New creates a new SSE service instance
func New() *Service {
    return &Service{
        clients: gmap.NewStrAnyMap(true),
    }
}

// Create creates an SSE connection
func (s *Service) Create(r *ghttp.Request) {
    // Set necessary HTTP headers for SSE
    r.Response.Header().Set("Content-Type", "text/event-stream")
    r.Response.Header().Set("Cache-Control", "no-cache")
    r.Response.Header().Set("Connection", "keep-alive")
    r.Response.Header().Set("Access-Control-Allow-Origin", "*")
    
    // Create new client
    clientId := r.Get("client_id", guid.S()).String()
    client := &Client{
        Id:      clientId,
        Request: r,
        messageChan: make(chan string, 100),
    }
    
    // Register client
    s.clients.Set(clientId, client)
    
    // Clean up when client disconnects
    defer func() {
        s.clients.Remove(clientId)
        close(client.messageChan)
    }()
    
    // Send connection success message
    r.Response.Writefln("id: %s", clientId)
    r.Response.Writefln("event: connected")
    r.Response.Writefln("data: {\"status\": \"connected\", \"client_id\": \"%s\"}\n", clientId)
    r.Response.Flush()
    
    // Handle message sending
    for {
        select {
        case msg, ok := <-client.messageChan:
            if !ok {
                return
            }
            // Send message to client
            r.Response.Writefln(msg)
            r.Response.Flush()

        case <-r.Context().Done():
            // Client disconnected
            return
        }
    }
}

// SendToClient sends a message to a specific client
func (s *Service) SendToClient(clientId, eventType, data string) bool {
    if client := s.clients.Get(clientId); client != nil {
        c := client.(*Client)
        msg := fmt.Sprintf(
            "id: %d\nevent: %s\ndata: %s\n\n", 
            time.Now().UnixNano(), eventType, data,
        )
        // Try to send message, skip if buffer is full
        select {
        case c.messageChan <- msg:
            return true
        default:
            return false
        }
    }
    return false
}

// BroadcastMessage broadcasts a message to all clients
func (s *Service) BroadcastMessage(eventType, data string) int {
    count := 0
    s.clients.Iterator(func(k string, v interface{}) bool {
        if s.SendToClient(k, eventType, data) {
            count++
        }
        return true
    })
    return count
}

// heartbeatSender sends periodic heartbeats
func (s *Service) heartbeatSender() {
    ticker := time.NewTicker(30 * time.Second)
    defer ticker.Stop()
    
    for range ticker.C {
        s.clients.Iterator(func(k string, v interface{}) bool {
            client := v.(*Client)
            select {
            case client.messageChan <- ": heartbeat\n\n":
                // Heartbeat sent successfully
            default:
                // Message buffer full, client might be disconnected
            }
            return true
        })
    }
}
```

#### 4.2.3 Using the Service in a Controller

##### 4.2.3.1 Creating the Controller
```go
// internal/controller/sse/sse.go

type Controller struct {
    service *sse.Service
}

func New() *Controller {
    return &Controller{
        service: sse.New(),
    }
}
```

##### 4.2.3.2 Creating the SSE Interface

```go
type SseReq struct {
    g.Meta `path:"/sse/create" method:"post"`
}
type SseRes struct {}

// Sse SSE connection
func (c *Controller) Sse(ctx context.Context, req *SseReq)(res *SseRes, err error) {
    c.service.Create(r.RequestFromCtx(ctx))
    return &SseRes{}, nil
}
```

##### 4.2.3.3 Message Sending Interface

```go
type SendMessageReq struct {
    g.Meta `path:"/sse/send" method:"post"`
    ClientId  string 
    EventType string 
    Data      string 
}
type SendMessageRes struct {}

// SendMessage sends a message to a specific client
func (c *Controller) SendMessage(ctx context.Context, req *SendMessageReq)(res *SendMessageRes, err error) {
    success := c.service.SendToClient(req.ClientId, req.EventType, req.Data)
    return &SendMessageRes{}, nil
}
```

##### 4.2.3.4 Message Broadcasting Interface

```go
type BroadcastMessageReq struct {
    g.Meta `path:"/sse/broadcast" method:"post"`
    EventType string 
    Data      string 
}
type BroadcastMessageRes struct {}

// BroadcastMessage broadcasts a message to all clients
func (c *Controller) BroadcastMessage(ctx context.Context, req *BroadcastMessageReq)(res *BroadcastMessageRes, err error) {
    count := c.service.BroadcastMessage(req.EventType, req.Data)
    return &BroadcastMessageRes{}, nil
}
```

#### 4.2.4 Registering Routes

```go
s := g.Server()
s.Group("/api", func(group *ghttp.RouterGroup) {
    group.Bind("/", sse.New())
})
```

### 4.3 client_id Design and Client Interaction

A key design in implementing an `SSE` service is the management of `client_id`. The `client_id` is used to uniquely identify each `SSE` connection, allowing the server to send messages accurately to specific clients.

#### 4.3.1 Generating and Retrieving client_id

In `GoFrame`, we use the following method to generate and retrieve `client_id`:

```go
// Get or generate client Id
clientId := r.Get("client_id", guid.S()).String()
```

This line of code works as follows:

1. First, try to get `client_id` from the request parameters, allowing clients to pass their own Id in the request
2. If no `client_id` is provided in the request, use `guid.S()` to generate a new Id

`guid.S` returns a globally unique string identifier, ensuring that even if the client doesn't provide its own Id, we can still assign a unique identifier to each connection.

#### 4.3.2 client_id Client Interaction Flow

The complete client-server interaction flow is as follows:

1. **Client's first connection**: The client connects to the `SSE` endpoint via the `EventSource API` without providing a `client_id`

   ```javascript
   const eventSource = new EventSource('/api/sse');
   ```

2. **Server generates `client_id`**: The server uses `guid.S()` to generate a new `client_id`

3. **Server sends `client_id` to client**: The server sends a special event containing the `client_id` after the connection is established

   ```go
   // Send connection success message with client_id
   r.Response.Writefln("id: %s", clientId)
   r.Response.Writefln("event: connected")
   r.Response.Writefln("data: {\"status\": \"connected\", \"client_id\": \"%s\"}\n", clientId)
   ```

4. **Client saves `client_id`**: The client receives the `connected` event and saves the `client_id`

   ```javascript
   eventSource.addEventListener('connected', function(e) {
       const data = JSON.parse(e.data);
       clientId = data.client_id;
       console.log('Connected to SSE, client Id:', clientId);
   });
   ```

5. **Using `client_id` in subsequent requests**: The client includes the `client_id` in subsequent API requests

   ```javascript
   // Send request to server with client_id
   const response = await fetch('/api/ai/chat', {
       method: 'POST',
       headers: {
           'Content-Type': 'application/json',
       },
       body: JSON.stringify({
           prompt: prompt,
           client_id: clientId  // Send the saved client_id to the server
       })
   });
   ```

6. **Server uses `client_id` to send targeted messages**: The server processes the request and uses the `client_id` to send the response to the correct `SSE` connection

   ```go
   // Send to client
   c.service.SendToClient(clientId, "ai_response", string(data))
   ```

#### 4.3.3 client_id Storage and Management

On the server side, we use a thread-safe memory map to manage all client connections:

```go
// SseService SSE service
type SseService struct {
    clients *gmap.StrAnyMap  // Stores all client connections
}
```

When a client connects, we add it to the map:

```go
// Register client
s.clients.Set(clientId, client)
```

When a client disconnects, we remove it from the map:

```go
// Clean up when client disconnects
defer func() {
    s.clients.Remove(clientId)
    close(client.messageChan)
}()
```



### 4.4 Using SSE in AI Applications

Below, we'll implement a simple AI streaming output application that simulates a large language model's character-by-character response:

```go
// controller/ai/chat.go

// Preset answers to simulate AI responses
var aiResponses = `
GoFrame is a modular, high-performance, enterprise-level Go basic development framework.
SSE (Server-Sent Events) is a technology that allows servers to push data to clients.
Unlike WebSocket, SSE is one-way communication, only allowing servers to send data to clients.
Using SSE can implement streaming output of AI models, enhancing the user experience.
`

// StreamChatRequest Streaming chat request
type StreamChatRequest struct {
    g.Meta `path:"/ai/stream-chat" method:"post"`
    Prompt   string `v:"required#Please enter a question"`
    ClientId string `v:"required#Please enter client_id"`
}

// StreamChatResponse Streaming chat response
type StreamChatResponse struct {
    Content string `json:"content"`
    Done    bool   `json:"done"`
}

// StreamChat Streaming chat API
func (c *Controller) StreamChat(ctx context.Context, req *StreamChatRequest) (res *StreamChatResponse, err error){
    // Get or generate client Id
    if req.ClientId == "" {
        req.ClientId = guid.S()
    }
    
    // Start a goroutine to simulate AI processing and streaming response
    go func() {
        // Split the answer into individual characters
        words := gstr.SplitAndTrim(aiResponses, " ")

        // Simulate thinking time
        time.Sleep(500 * time.Millisecond)
        
        // Send answer character by character
        for i, char := range words {
            // Build response
            resp := StreamChatResponse{
                Content: char,
                Done:    i == len(words)-1,
            }
            
            // Convert to JSON
            data, _ := json.Marshal(resp)
            
            // Send to client
            c.service.SendToClient(req.ClientId, "ai_response", string(data))
            
            // Simulate typing delay
            time.Sleep(100 * time.Millisecond)
        }
    }()
    
    // Return success, actual content will be sent via SSE
    return &StreamChatResponse{
        Content: "Request received, response will be streamed via SSE",
        Done:    true,
    }, nil
}
```

Register this API in the router:

```go
s := g.Server()
s.Group("/api", func(group *ghttp.RouterGroup) {
    // SSE API
    group.Bind("/", sse.New())
    // AI chat API
    group.Bind("/", ai.New())
})
```

### 4.5 Implementing Distributed SSE Services with Redis

In production environments, we typically need to deploy multiple service instances to handle a large number of requests.
To ensure that `SSE` messages are correctly transmitted between different instances, we can use Redis's **publish/subscribe** functionality to implement distributed `SSE` services.


#### 4.5.1 client_id Application in Distributed Systems

In distributed systems, clients may connect to different service instances (`HTTP Server`). In this case, the role of `client_id` becomes even more important:

1. Clients save `client_id` and use it in all requests
2. Servers use distributed messaging systems like `Redis` to route messages to the correct service instance

```go
// Publish message to Redis, including client_id information
msg := RedisMessage{
    ClientId:  clientId,  // Specify target client
    EventType: eventType,
    Data:      data,
    Broadcast: broadcast,
}
```

This design ensures that even in multi-service instance environments, messages can be accurately sent to the specified client.


#### 4.5.2 Publishing Redis Messages

```go
// internal/logic/sse/sse_redis.go

// Redis channel name
const (
    RedisSseChannel = "sse:messages"
)

// PublishToRedis publishes a message to Redis
func (s *Service) PublishToRedis(clientId, eventType, data string, broadcast bool) error {
    msg := RedisMessage{
        ClientId:  clientId,
        EventType: eventType,
        Data:      data,
        Broadcast: broadcast,
    }
    
    // Serialize message
    bytes, err := json.Marshal(msg)
    if err != nil {
        return err
    }
    
    // Publish to Redis
    _, err = s.redis.Publish(ctx, RedisSseChannel, string(bytes))
    return err
}
```

#### 4.5.3 Subscribing to Redis Messages

```go
// internal/logic/sse/sse_redis.go

// StartRedisSubscriber starts the Redis subscriber
func (s *Service) StartRedisSubscriber() error {
    ctx := context.Background()
    
    // Create redis subscription object
    pubsub := s.redis.Subscribe(ctx, RedisSseChannel)
    defer pubsub.Close() 
    
    // Get message channel
    msgChan := pubsub.Channel()
    
    go func() {
        // Process received messages
        for msg := range msgChan {
            var redisMsg RedisMessage
            if err := json.Unmarshal([]byte(msg.Payload), &redisMsg); err != nil {
                g.Log().Error(ctx, "Parse redis message error:", err)
                continue
            }
            
            // Process message
            if redisMsg.Broadcast {
                // Broadcast message
                s.BroadcastMessage(redisMsg.EventType, redisMsg.Data)
            } else if redisMsg.ClientId != "" {
                // Send to specific client
                s.SendToClient(redisMsg.ClientId, redisMsg.EventType, redisMsg.Data)
            }
        }
    }()
    
    return nil
}

// SendMessage sends a message to a specific client
func (s *Service) SendMessage(clientId, eventType, data string) error {
    return s.PublishToRedis(clientId, eventType, data, false)
}

// BroadcastMessage broadcasts a message to all clients
func (s *Service) BroadcastMessage(eventType, data string) error {
    return s.PublishToRedis("", eventType, data, true)
}
```

#### 4.5.4 Initializing the Redis Subscriber

Finally, initialize the `Redis` subscriber when the service starts:

```go
// main.go
func main() {
    // Start Redis subscriber
    sseService.StartRedisSubscriber()
    
    // Start HTTP service
    // ...
}
```

## 5. Best Practices for SSE Implementation

When implementing an `SSE` service, there are some best practices to keep in mind:

### 5.1 Server Configuration

#### 5.1.1 Server Concurrent Connection Optimization

`SSE` connections remain open for a long time, requiring appropriate server optimization to handle a large number of concurrent connections.

```bash
# Increase system open file limit
sysctl -w fs.file-max=100000

# Adjust current user's limit
ulimit -n 100000
```

> If you're using a cloud server, cloud service providers typically have already optimized system configurations. Please check and confirm the system configuration.

#### 5.1.2 Adjusting Timeout Settings

`SSE` connections need to be maintained for a long time, so relevant timeout settings should be adjusted.

```go
// Adjust timeout settings
s.SetReadTimeout(0)      // Disable read timeout
s.SetWriteTimeout(0)     // Disable write timeout
s.SetIdleTimeout(0)      // Disable idle timeout
```

> If you're using the `GoFrame` framework to implement `SSE`, write time does not time out under the default configuration. Therefore, developers do not need to make additional configurations to the `Server`.

### 5.2 Client Reconnection Mechanism

Although the browser's `EventSource API` has a built-in reconnection mechanism, in some cases, custom reconnection logic may be needed:

```javascript
// Custom reconnection logic
let reconnectAttempts = 0;
const maxReconnectAttempts = 5;
const baseReconnectDelay = 1000; // 1 second

function connectSSE() {
    eventSource = new EventSource('/api/sse');
    
    // Reset reconnection count when connection opens
    eventSource.onopen = function() {
        reconnectAttempts = 0;
        console.log('SSE connection established');
    };
    
    // Error handling and reconnection
    eventSource.onerror = function(e) {
        eventSource.close();
        
        if (reconnectAttempts < maxReconnectAttempts) {
            reconnectAttempts++;
            // Exponential backoff reconnection
            const delay = baseReconnectDelay * Math.pow(2, reconnectAttempts - 1);
            console.log(`Reconnecting in ${delay}ms (attempt ${reconnectAttempts}/${maxReconnectAttempts})`);
            setTimeout(connectSSE, delay);
        } else {
            console.error('Max reconnect attempts reached');
        }
    };
}
```

### 5.3 Resource Management

#### 5.3.1 Closing Unused Connections

The server periodically checks and closes connections that have been idle for a long time to avoid resource waste.

```go
// Add last activity time field
type Client struct {
    Id            string
    messageChan   chan string
    lastActiveTime time.Time
}

// Periodically clean up idle connections
func (s *Service) startIdleConnectionCleaner() {
    ticker := time.NewTicker(5 * time.Minute)
    defer ticker.Stop()
    
    for range ticker.C {
        now := time.Now()
        // Use LockFunc to safely perform deletion operations
        s.clients.LockFunc(func(m map[string]interface{}) {
            for k, v := range m {
                client := v.(*Client)
                // If there has been no activity for more than 30 minutes, close the connection
                if now.Sub(client.lastActiveTime) > 30*time.Minute {
                    close(client.messageChan)
                    delete(m, k)
                }
            }
        })
    }
}
```

#### 5.3.2 Limiting Connections

To prevent resource exhaustion, you can limit the maximum number of connections per IP.

```go
// Add IP connection counter
var ipConnections = gmap.NewStrIntMap(true)

func (s *Service) Create(r *ghttp.Request) {
    // Get client IP
    clientIp := r.GetClientIp()
    
    // Check connection limit before creating a new SSE connection
    if count := ipConnections.GetOrSet(clientIp, 0); count >= 5 {
        r.Response.WriteStatus(429, "Too many connections")
        return
    }
    
    // Increase connection count
    ipConnections.Add(clientIp, 1)
    
    // Decrease count when connection closes
    defer ipConnections.Add(clientIp, -1)
    
    // Continue processing SSE connection...
}
```

### 5.4 Message Queue Optimization

For high-concurrency scenarios, a more efficient message queue consumption design can be used, processing messages in parallel through multiple `goroutines` to reduce message processing latency:

```go
// Use a buffered channel as a message queue
var messageQueue = make(chan RedisMessage, 1000)

// Start Redis subscriber and distribute messages to worker goroutines
func (s *Service) StartRedisSubscriber(ctx context.Context, workerCount int) error {
    // Create redis subscription object
    pubsub := s.redis.Subscribe(ctx, RedisSseChannel)
    
    // Get message channel
    msgChan := pubsub.Channel()
    
    // Start message distribution goroutine
    go func() {
        defer pubsub.Close()
        
        for msg := range msgChan {
            // Parse message
            var redisMsg RedisMessage
            if err := json.Unmarshal([]byte(msg.Payload), &redisMsg); err != nil {
                continue
            }
            
            // Send message to work queue
            select {
            case messageQueue <- redisMsg:
                // Message successfully sent to queue
            default:
                // Queue is full, discard message
            }
        }
    }()
    
    // Start worker goroutine pool
    for i := 0; i < workerCount; i++ {
        go func() {
            for msg := range messageQueue {
                // Process message
                if msg.Broadcast {
                    s.BroadcastMessage(msg.EventType, msg.Data)
                } else {
                    s.SendToClient(msg.ClientId, msg.EventType, msg.Data)
                }
            }
        }()
    }
    
    return nil
}
```

> Here you can also use the `grpool` goroutine pool to manage `goroutines`.

### 5.5 Monitoring and Logging

Implement monitoring metrics collection to identify issues promptly, including at least the following key metrics:
```go
type SseMetrics struct {
    ActiveConnections    int64 // Current active connections
    TotalConnections     int64 // Total connections
    MessagesSent         int64 // Number of messages sent
    MessagesDropped      int64 // Number of messages dropped
    ReconnectCount       int64 // Number of reconnections
}
// ...
```

> You can use the `gmetric` component provided by the framework to implement the collection and reporting of monitoring metrics. This will not be elaborated here; please refer to the service observability related chapters on the `GoFrame` official website for details.

## 6. Conclusion

This article has provided a detailed introduction to implementing `Server-Sent Events (SSE)` technology in the `GoFrame` framework, covering everything from basic concepts to practical applications.

`SSE`, as a lightweight real-time communication technology, has advantages such as simple implementation, good compatibility, and low resource consumption, making it very suitable for various scenarios that require servers to actively push data, such as real-time notifications, data updates, AI applications, etc.

Key points for implementing `SSE` in `GoFrame` include:

1. **Basic Infrastructure**: Establishing client connection management, message sending, and heartbeat detection infrastructure

2. **Message Processing**: Implementing single-client message sending and broadcast messaging capabilities to meet different business scenarios

3. **Distributed Deployment**: Using Redis's publish/subscribe functionality to synchronize messages between multiple instances

4. **Performance Optimization**: Ensuring system stability through multi-goroutine processing, connection management, and resource limitations

5. **Best Practices**: Providing practical suggestions for server configuration, client reconnection, resource management, etc.

By adopting the solution provided in this article, developers can quickly integrate `SSE` functionality into `GoFrame` projects, building high-performance, scalable real-time communication systems. Whether developing AI applications, real-time dashboards, or social platforms, `SSE` is a technology worth considering.

In practical applications, developers should make appropriate adjustments and optimizations based on specific business requirements and system scale, such as enhancing error handling, adding monitoring metrics, or integrating more complex message queue systems.
