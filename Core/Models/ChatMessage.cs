using System;
using System.IO;
using System.Diagnostics;
using System.Collections.Generic;

using Echo.Core.Models.ChatTokens;
namespace Echo.Core.Models
{
    public class ChatMessage
    {
        public byte[] Bytes { get; set; }
        public string MessageType { get; set; }
        public ChatMessageSource MessageSource { get; set; }
        public ChatMessageContent MessageContent { get; set; }

        // A Chat Message is a ChatHeaderToken followed by a ChatBodyToken
        private ChatHeaderToken _header;
        private ChatSegmentToken _source;
        private ChatSegmentToken _body;

        public ChatMessage(byte[] bytes)
        {
            Bytes = bytes;
        }

        public bool Tokenize()
        {
            byte[] headerBytes;
            byte[] sourceBytes;
            byte[] payloadBytes;
            List<byte> byteList = new List<byte>();
            using(var s = new MemoryStream(Bytes))
            {
                using(var reader = new BinaryReader(s))
                {
                    // Segment 1 is the header, terminated by 1F
                    do
                    {
                        byte b = reader.ReadByte();
                        if(b == 0x1F)
                            break;
                        byteList.Add(b);
                    }
                    while(s.Position < s.Length);

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

            bool success = (
                _header.Tokenize()
                && _source.Tokenize()
                && _body.Tokenize()
            );
            if (!success)
                return false;

            // extract data
            this.MessageType = _header.OpCode;
            this.MessageSource = new ChatMessageSource(_source);
            this.MessageContent = new ChatMessageContent(_body);
            Debug.WriteLine($"{_header.BuildMessage()}:{_source.BuildMessage()}:{_body.BuildMessage()}");

            return success;
        }
    }
}
