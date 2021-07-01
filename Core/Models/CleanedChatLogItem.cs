using System;
using System.IO;
using System.Text;
using System.Linq;
using System.Diagnostics;
using System.Collections.Generic;
using System.Text.RegularExpressions;

using Sharlayan.Core;
namespace Echo.Core.Models
{
using Sharlayan.Models;
    public class CleanedChatLogItem
    {
        public byte[] Bytes { get; set; }
        public string Code { get; set; }
        public string Combined { get; set; }
        public bool IsInternational { get; set; }
        public string PlayerName { get; set; }
        public string PlayerServer { get; set; }
        public string Message { get; set; }
        public string Raw { get; set; }
        public DateTime TimeStamp { get; set; }
        public List<ControlToken> Tokens { get; set; }

        public CleanedChatLogItem()
        {
            Tokens = new List<ControlToken>();
        }

        public CleanedChatLogItem(ChatLogItem item) : this()
        {
            this.Bytes = item.Bytes;
            this.Code = item.Code;
            this.Combined = item.Combined;
            this.IsInternational = item.IsInternational;
            this.Message = item.Message;
            this.Raw = item.Raw;
            this.TimeStamp = item.TimeStamp;
            this.ProcessMessageData(item);
            this.CleanMessageData();
            this.ExtractMessageData();
        }

        public void ProcessMessageData(ChatLogItem item)
        {
            string hex = BitConverter.ToString(item.Bytes)
                .Replace("-", string.Empty);
            //Debug.WriteLine(hex);

            // constant offset of 8 bytes
            using (Stream s = new MemoryStream(item.Bytes))
            {
                // move to start of stream
                s.Seek(0, SeekOrigin.Begin);

                using (var reader = new BinaryReader(s))
                {
                    // parse tokens
                    s.Seek(9, SeekOrigin.Current);
                    while (s.Position < s.Length)
                    {
                        byte b = reader.ReadByte();
                        switch(b)
                        {
                            case 0x02:
                                byte controlType = reader.ReadByte();
                                switch(controlType)
                                {
                                    default:
                                        var token = ControlToken.Process(controlType, reader);
                                        Tokens.Add(token);
                                        break;
                                }
                                break;
                            default:
                                break;
                        }
                    }
                }
            }
        }

        public void CleanMessageData()
        {
            int idx = 0;
            ChatLinkTokenOld unpaired = null;
            while (idx < Tokens.Count)
            {
                var link = Tokens[idx];
                if (link is ChatLinkTokenOld)
                {
                    if (unpaired is null)
                    {
                        unpaired = (ChatLinkTokenOld)link;
                        idx++;
                    }
                    else
                    {
                        // CF010101 marks the end of a chat link
                        if (((ChatLinkTokenOld)link).LinkType == "CF010101")
                        {
                            unpaired = null;
                            Tokens.RemoveAt(idx);
                        }
                        else
                        {
                            Debug.WriteLine("SCREAMING");
                            Debug.WriteLine(((ChatLinkTokenOld)link).LinkType);
                        }
                    }
                }
                else
                {
                    if (link is ChatServerToken)
                    {
                        if (Tokens[idx - 1] is ChatLinkTokenOld)
                        {
                            // associate them!
                        }
                    }
                    idx++;
                }
            }
        }

        public void ExtractMessageData()
        {
            this.PlayerName = "";
            for(int i=0; i<Tokens.Count; i++)
            {
                var token = Tokens[i];
                if(token is ChatLinkTokenOld)
                {
                    this.PlayerName = ((ChatLinkTokenOld)token).LinkValue;
                    if(i + 1 < Tokens.Count)
                    {

                        if(Tokens[i + 1] is ChatServerToken)
                        {
                            this.PlayerServer = ((ChatServerToken)Tokens[i + 1]).ServerName;
                        }
                    }
                    break;
                }
            }
        }
    }
}
