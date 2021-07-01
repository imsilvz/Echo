using System;
using System.IO;
using System.Reflection;
using System.Diagnostics;
using System.Collections.Generic;
using System.Threading.Tasks;

using Sharlayan;
using Sharlayan.Core;
using Sharlayan.Enums;
using Sharlayan.Models;
using Sharlayan.Models.ReadResults;

using Echo.Controllers;
namespace Echo 
{
    public class Program {
        public static DataBroker Broker;

        [STAThread]
        public static void Main(string[] args)
        {
            Broker = new DataBroker();

            // Create Directory!
            var path = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData);
            Directory.CreateDirectory($"{path}/Echo/cache");

            var app = new App();
            app.Run();
        }
    }
}