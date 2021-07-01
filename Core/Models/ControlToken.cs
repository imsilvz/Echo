using System;
using System.IO;
using System.Text;
using System.Linq;
using System.Collections.Generic;

namespace Echo.Core.Models
{
    public class ControlToken
    { 
        public string OpCode { get; set; }
        public byte[] Data { get; set; }
        public static ControlToken Process(byte OpCode, BinaryReader reader)
        {
            switch (OpCode)
            {
                case 0x12:
                    {
                        int tokenLength = reader.ReadByte();
                        var data = reader.ReadBytes(tokenLength);

                        if(BitConverter.ToInt16(data) != 0x0359)
                        {
                            return new ControlToken
                            {
                                OpCode = OpCode.ToString("X2"),
                                Data = data
                            };
                        }

                        // seek server name
                        byte b;
                        string serverName = null;
                        List<byte> byteList = new List<byte>();
                        do
                        {
                            byteList.Add(reader.ReadByte());

                            var byteArr = byteList.ToArray();
                            var parsed = Encoding.UTF8.GetString(byteArr);

                            if(Constants.Servers.Contains(parsed))
                            {
                                serverName = parsed;
                                break;
                            }
                        }
                        while (reader.BaseStream.Position < reader.BaseStream.Length);

                        return new ChatServerToken
                        {
                            OpCode = OpCode.ToString("X2"),
                            ServerName = serverName,
                            Data = data
                        };
                    }
                case 0x27:
                    {
                        int tokenLength = reader.ReadByte();
                        var data = reader.ReadBytes(tokenLength);
                        var delimIdx = Array.IndexOf<byte>(data, 0xFF);

                        if(delimIdx < 0)
                        {
                            return new ControlToken
                            {
                                OpCode = OpCode.ToString("X2"),
                                Data = data
                            };
                        }
                        var linkType = BitConverter.ToString(data, 0, delimIdx).Replace("-", "");
                        var linkValue = Encoding.UTF8.GetString(data, delimIdx + 2, data.Length - (delimIdx + 3));//BitConverter.ToString(data, delimIdx + 1, data.Length - (delimIdx + 1)).Replace("-", "");

                        return new ChatLinkToken
                        {
                            OpCode = OpCode.ToString("X2"),
                            LinkType = linkType,
                            LinkValue = linkValue,
                            Data = data
                        };
                    }
                default:
                    {
                        int tokenLength = reader.ReadByte();
                        var data = reader.ReadBytes(tokenLength);
                        return new ControlToken
                        {
                            OpCode = OpCode.ToString("X2"),
                            Data = data
                        };
                    }
            }
        }

        public override string ToString()
        {
            string hex = BitConverter.ToString(this.Data)
                .Replace("-", string.Empty);
            return $"ControlToken ({OpCode}): {hex}";
        }
    }
}
