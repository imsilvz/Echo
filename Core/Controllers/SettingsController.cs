using System;
using System.IO;
using System.Text.Json;
using System.Reflection;
using System.Diagnostics;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Echo.Core.Models.Settings;
namespace Echo.Core.Controllers
{
    public class SettingsController
    {
        private static Lazy<SettingsController> _instance = new Lazy<SettingsController>(() => new SettingsController());
        public static SettingsController Instance => _instance.Value;

        private string _dataPath;
        private string _cachePath;
        private EchoSettings _settings;
        public SettingsController()
        {
            var appData = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData);
            _dataPath = $"{appData}/Echo";
            _cachePath = $"{_dataPath}/cache";

            this.SetupDirectories();
            this.SetupSettingsFiles();
        }

        public void OnApplicationShutdown()
        {
            var jsonOptions = new JsonSerializerOptions
            {
                ReadCommentHandling = JsonCommentHandling.Skip,
                IgnoreNullValues = true,
                WriteIndented = true,
            };

            var settingsJson = JsonSerializer.Serialize(_settings, jsonOptions);
            File.WriteAllText($"{_dataPath}/settings.json", settingsJson);
        }

        public void OnSettingsUpdate(string json)
        {
            var updatedSettings = JsonSerializer.Deserialize<EchoSettings>(
                json
            );
            _settings = updatedSettings;
        }

        private void SetupDirectories()
        {
            Directory.CreateDirectory(_cachePath);
        }

        private void SetupSettingsFiles()
        {
            var jsonOptions = new JsonSerializerOptions
            {
                ReadCommentHandling = JsonCommentHandling.Skip,
                IgnoreNullValues = true,
                WriteIndented = true,
            };

            // check if the settings file exists
            if(File.Exists($"{_dataPath}/settings.json"))
            {
                // load the settings file
                string settingsJson = File.ReadAllText($"{_dataPath}/settings.json");
                _settings = JsonSerializer.Deserialize<EchoSettings>(settingsJson, jsonOptions);
            }
            else
            {
                // load Default Settings and write settings file.
                string settingsJson;
                _settings = new EchoSettings();
                settingsJson = JsonSerializer.Serialize(_settings, jsonOptions);
                File.WriteAllText($"{_dataPath}/settings.json", settingsJson);
            }
        }

        public string GetCachePath()
        {
            return _cachePath;
        }

        public string GetDataPath()
        {
            return _dataPath;
        }

        public string GetSettingsJson()
        {
            var jsonOptions = new JsonSerializerOptions
            {
                ReadCommentHandling = JsonCommentHandling.Skip,
                IgnoreNullValues = true,
                WriteIndented = true,
            };

            return JsonSerializer.Serialize(_settings, jsonOptions);
        }
    }
}
