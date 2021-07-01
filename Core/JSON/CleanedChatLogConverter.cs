using System;
using System.Globalization;
using System.Text.Json;
using System.Text.Json.Serialization;

using Echo.Core.Models;
namespace Echo.Core.JSON
{
    public class CleanedChatLogConverter : JsonConverter<CleanedChatLogItem>
    {
        public override CleanedChatLogItem Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            throw new NotImplementedException();
        }

        public override void Write(Utf8JsonWriter writer, CleanedChatLogItem value, JsonSerializerOptions options)
        {
            writer.WriteStartObject();
            writer.WriteBase64String("Bytes", value.Bytes);
            writer.WriteString("Code", value.Code);
            writer.WriteString("Combined", value.Combined);
            writer.WriteBoolean("IsInternational", value.IsInternational);
            writer.WriteString("PlayerName", value.PlayerName);
            writer.WriteString("PlayerServer", value.PlayerServer);
            writer.WriteString("Message", value.Message);
            writer.WriteString("Raw", value.Raw);
            writer.WritePropertyName("TimeStamp");
            JsonSerializer.Serialize(writer, value.TimeStamp, options);

            writer.WritePropertyName("Tokens");
            writer.WriteStartArray();
            foreach(var token in value.Tokens)
            {
                JsonSerializer.Serialize(writer, token, token.GetType(), options);
            }
            writer.WriteEndArray();

            writer.WriteEndObject();
        }
    }
}
