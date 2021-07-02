using System;
using System.IO;
using System.Diagnostics;
using System.Collections.Generic;

using System.Text;
using System.Text.Json;

using Echo.Core.Models.ChatTokens;
namespace Echo.Core.Models
{
    public class ChatMessage
    {
        public string MessageType { get; set; }
        public string Combined { get; set; }
        public DateTime Timestamp { get; set; }
        public ChatMessageSource MessageSource { get; set; }
        public ChatMessageContent MessageContent { get; set; }

        // A Chat Message is a ChatHeaderToken followed by a ChatBodyToken
        private byte[] _bytes;
        private ChatHeaderToken _header;
        private ChatSegmentToken _source;
        private ChatSegmentToken _body;

        public ChatMessage(byte[] bytes)
        {
            _bytes = bytes;
        }

        public bool Tokenize()
        {
            byte[] headerBytes;
            byte[] sourceBytes;
            byte[] payloadBytes;
            List<byte> byteList = new List<byte>();
            using(var s = new MemoryStream(_bytes))
            {
                using(var reader = new BinaryReader(s))
                {
                    // I don't think this will every happen
                    // But since some messages start with 1F
                    // we will read the header differently
                    if (s.Length < 9) { return false; }

                    // Segment 1 is the header, 8 bytes long, terminated by 1F
                    for(int i=0; i<8; i++)
                    {
                        byte b = reader.ReadByte();
                        byteList.Add(b);
                    }
                    byte term = reader.ReadByte();

                    // verify it is a proper terminator
                    if(term != 0x1F) { return false; }

                    headerBytes = byteList.ToArray();
                    byteList.Clear();

                    // Segment 2 is the source, terminated by 1F
                    do
                    {
                        byte b = reader.ReadByte();
                        if (b == 0x1F)
                            break;
                        byteList.Add(b);
                    }
                    while (s.Position < s.Length);

                    sourceBytes = byteList.ToArray();
                    byteList.Clear();

                    // Segment 3 (Body/Payload) is everything that remains in the message
                    do
                    {
                        byte b = reader.ReadByte();
                        byteList.Add(b);
                    }
                    while (s.Position < s.Length);

                    payloadBytes = byteList.ToArray();
                    byteList.Clear();
                }
            }

            _header = new ChatHeaderToken(headerBytes);
            _source = new ChatSegmentToken(sourceBytes);
            _body = new ChatSegmentToken(payloadBytes);

            bool success1 = _header.Tokenize();
            bool success2 = _source.Tokenize();
            bool success3 = _body.Tokenize();

            if (success1 && success2 && success3)
            {
                Combined = $"{_header.BuildMessage()}:{_source.BuildMessage()}:{_body.BuildMessage()}";
                return true;
            }
            Debug.WriteLine($"Header:{success1}:Source:{success2}:Body:{success3}");
            return false;
        }

        public ChatMessage Resolve()
        {
            // extract data
            this.MessageType = _header.OpCode;
            this.MessageSource = new ChatMessageSource(_source).ResolveSource(this.MessageType);
            this.MessageContent = new ChatMessageContent(_body).ResolveContent(this.MessageType);
            this.Timestamp = _header.Timestamp;
            return this;
        }
    }
}
