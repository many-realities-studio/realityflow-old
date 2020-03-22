using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Collections;
using UnityEngine;
using System.Runtime.InteropServices;
#if UNITY_WSA_10_0 && !UNITY_EDITOR
using Windows.Networking.Sockets;
#endif
#if !UNITY_EDITOR
using Windows;
using System.Threading.Tasks;
#endif

public class WebSocket
{
    private Uri mUrl;
    private Queue<string> cmds = new Queue<string>();

    public WebSocket(Uri url)
    {
        mUrl = url;

        string protocol = mUrl.Scheme;
        if (!protocol.Equals("ws") && !protocol.Equals("wss"))
            throw new ArgumentException("Unsupported protocol: " + protocol);
    }

    public void SendString(string str)
    {
#if !UNITY_EDITOR
        SendMessageUsingMessageWebSocketAsync(str);
#else
        Send(Encoding.UTF8.GetBytes(str));
#endif
    }

    public string RecvString()
    {
#if !UNITY_EDITOR
        if(cmds.Count == 0)
            return null;
        return cmds.Dequeue();
#else
        byte[] retval = Recv();
        if (retval == null)
            return null;
        return Encoding.UTF8.GetString(retval);
#endif
    }

#if UNITY_WEBGL && !UNITY_EDITOR
	[DllImport("__Internal")]
	private static extern int SocketCreate (string url);

	[DllImport("__Internal")]
	private static extern int SocketState (int socketInstance);

	[DllImport("__Internal")]
	private static extern void SocketSend (int socketInstance, byte[] ptr, int length);

	[DllImport("__Internal")]
	private static extern void SocketRecv (int socketInstance, byte[] ptr, int length);

	[DllImport("__Internal")]
	private static extern int SocketRecvLength (int socketInstance);

	[DllImport("__Internal")]
	private static extern void SocketClose (int socketInstance);

	[DllImport("__Internal")]
	private static extern int SocketError (int socketInstance, byte[] ptr, int length);

	int m_NativeRef = 0;

	public void Send(byte[] buffer)
	{
		SocketSend (m_NativeRef, buffer, buffer.Length);
	}

	public byte[] Recv()
	{
		int length = SocketRecvLength (m_NativeRef);
		if (length == 0)
			return null;
		byte[] buffer = new byte[length];
		SocketRecv (m_NativeRef, buffer, length);
		return buffer;
	}

	public IEnumerator Connect()
	{
		m_NativeRef = SocketCreate (mUrl.ToString());

		while (SocketState(m_NativeRef) == 0)
			yield return 0;
	}
 
	public void Close()
	{
        FlowNetworkManager.log("Closing connection");
        
		SocketClose(m_NativeRef);
	}

	public string error
	{
		get {
			const int bufsize = 1024;
			byte[] buffer = new byte[bufsize];
			int result = SocketError (m_NativeRef, buffer, bufsize);

			if (result == 0)
				return null;

			return Encoding.UTF8.GetString (buffer);				
		}
	}
#elif !UNITY_WSA_10_0 || UNITY_EDITOR

    public string error
    {
        get
        {
            return m_Error;
        }
    }

    public void Close()
    {
        m_Socket.Close();
    }

#if !UNITY_EDITOR
    Windows.Networking.Sockets.MessageWebSocket m_Socket;
#else
    WebSocketSharp.WebSocket m_Socket;
#endif

#elif UNITY_WSA_10_0 && !UNITY_EDITOR
    MessageWebSocket m_Socket;
#endif

    Queue<byte[]> m_Messages = new Queue<byte[]>();
    bool m_IsConnected = false;
    string m_Error = null;
    public bool connected = false;
#if !UNITY_WEBGL || UNITY_EDITOR || !UNITY_EDITOR
    public IEnumerator Connect()
    {
#endif

#if !UNITY_EDITOR
        m_Socket = new Windows.Networking.Sockets.MessageWebSocket();

        // In this example, we send/receive a string, so we need to set the MessageType to Utf8.
        m_Socket.Control.MessageType = Windows.Networking.Sockets.SocketMessageType.Utf8;

        m_Socket.MessageReceived += WebSocket_MessageReceived;
        m_Socket.Closed += WebSocket_Closed;

        try
        {
            Task connectTask = m_Socket.ConnectAsync(new Uri(mUrl.ToString())).AsTask();
           // connectTask.ContinueWith(_ => this.SendMessageUsingMessageWebSocketAsync("Hello, World!"));
        }
        catch (Exception ex)
        {
            Windows.Web.WebErrorStatus webErrorStatus = Windows.Networking.Sockets.WebSocketError.GetStatus(ex.GetBaseException().HResult);
            // Add additional code here to handle exceptions.
            FlowNetworkManager.log(ex.Message);
        }

        yield return 0;
    }

    private async Task SendMessageUsingMessageWebSocketAsync(string message)
    {
        using (var dataWriter = new Windows.Storage.Streams.DataWriter(m_Socket.OutputStream))
        {
            dataWriter.WriteString(message);
            await dataWriter.StoreAsync();
            dataWriter.DetachStream();
        }
        FlowNetworkManager.log("Sending message using MessageWebSocket: " + message);
    }

    private void WebSocket_MessageReceived(Windows.Networking.Sockets.MessageWebSocket sender, Windows.Networking.Sockets.MessageWebSocketMessageReceivedEventArgs args)
    {
        try
        {
            using (Windows.Storage.Streams.DataReader dataReader = args.GetDataReader())
            {
                dataReader.UnicodeEncoding = Windows.Storage.Streams.UnicodeEncoding.Utf8;
                string message = dataReader.ReadString(dataReader.UnconsumedBufferLength);
                Debug.Log("Message received from MessageWebSocket: " + message);
                cmds.Enqueue(message);
                //m_Socket.Dispose();
            }
        }
        catch (Exception ex)
        {
            Windows.Web.WebErrorStatus webErrorStatus = Windows.Networking.Sockets.WebSocketError.GetStatus(ex.GetBaseException().HResult);
            // Add additional code here to handle exceptions.
        }

    }

    public void Close()
    {
        m_Socket.Close(1000, "Closed") ;
    }

    public string error
    {
        get
        {
            return m_Error;
        }
    }

    private void WebSocket_Closed(Windows.Networking.Sockets.IWebSocket sender, Windows.Networking.Sockets.WebSocketClosedEventArgs args)
    {
        m_Error = "Closed";
        FlowNetworkManager.log("WebSocket_Closed; Code: " + args.Code + ", Reason: \"" + args.Reason + "\"");
        // Add additional code here to handle the WebSocket being closed.
    }
#elif (UNITY_EDITOR || (!UNITY_WSA_10_0 && !UNITY_WEBGL))
        m_Error = null;
        m_Socket = new WebSocketSharp.WebSocket(mUrl.ToString());
        m_Socket.OnMessage += (sender, e) => m_Messages.Enqueue(e.RawData);
        m_Socket.OnOpen += (sender, e) => { m_IsConnected = true; m_Error = null; };
        m_Socket.OnClose += (sender, e) => { m_Error = "Closed"; FlowNetworkManager.log("Closed!"); };
        m_Socket.OnError += (sender, e) => m_Error = e.Message;
        m_Socket.ConnectAsync();
        while (!m_IsConnected && m_Error == null)
        {
            yield return 0;
        }
    }

    public void Send(byte[] buffer)
    {
        m_Socket.Send(buffer);
    }

    public byte[] Recv()
    {
        if (m_Messages.Count == 0)
            return null;
        return m_Messages.Dequeue();
    }

#elif UNITY_WSA_10_0 && !UNITY_EDITOR
        m_Socket = new MessageWebSocket();
        m_Socket.MessageReceived += (sender, args) =>
        {
            Byte[] bytes = new Byte[args.GetDataReader().UnconsumedBufferLength];
            args.GetDataReader().ReadBytes(bytes);
            m_Messages.Enqueue(bytes);
        };
        connecting();
        while (!m_IsConnected && m_Error == null)
            yield return 0;
    }

    public async void connecting()
    {
        await m_Socket.ConnectAsync(mUrl);
        m_IsConnected = true;
    }

    public async void Send(byte[] buffer)
    {
        Windows.Storage.Streams.DataWriter messageWriter = new Windows.Storage.Streams.DataWriter(m_Socket.OutputStream);
        messageWriter.WriteBytes(buffer);
        await messageWriter.StoreAsync();
    }

    public byte[] Recv()
    {
        if (m_Messages.Count == 0)
            return null;
        return m_Messages.Dequeue();
    }

    public void Close()
    {
        m_Socket.Close(1000, "Closed") ;
    }

    public string error
    {
        get
        {
            return m_Error;
        }
    }
#else 
    }

#endif

}