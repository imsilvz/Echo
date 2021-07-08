using System;
using System.IO;
using System.Linq;
using System.Diagnostics;
using System.Collections.Generic;

using System.Text;
using System.Text.Json;

using Echo.Core.Models.ChatTokens;
namespace Echo.Core.Models
{
    public class ChatMessage
    {
        public string UUID { get; set; }
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
            UUID = $"Message_{Guid.NewGuid()}";
        }

        public bool Tokenize()
        {
            bool success1 = false;
            bool success2 = false;
            bool success3 = false;
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
                    _header = new ChatHeaderToken(headerBytes);
                    success1 = _header.Tokenize();

                    // read source bytes
                    long pos = s.Position;
                    sourceBytes = reader.ReadBytes((int)(s.Length - s.Position));
                    _source = new ChatSegmentToken(sourceBytes);
                    success2 = _source.Tokenize();

                    // verify it is a proper terminator
                    s.Seek(pos + _source.Data.Length, SeekOrigin.Begin);
                    term = reader.ReadByte();
                    if (term != 0x1F) { return false; }

                    // read body bytes
                    payloadBytes = reader.ReadBytes((int)(s.Length - s.Position));
                    _body = new ChatSegmentToken(payloadBytes);
                    success3 = _body.Tokenize();
                }
            }

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
