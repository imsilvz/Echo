using System;
using System.IO;
using System.Reflection;
using System.Windows;
using System.Windows.Input;
using System.Windows.Interop;
using System.Runtime.InteropServices;

using System.Diagnostics;

using Microsoft.Web.WebView2.Core;
using Microsoft.Web.WebView2.Wpf;

using Echo.Controllers;
namespace Echo
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            this.Deactivated += MainWindow_Deactivated;
            webView.CoreWebView2InitializationCompleted += WebView_InitializationCompleted;
            webView.NavigationCompleted += WebView_NavigationCompleted;
            InitializeAsync();
        }

        async void InitializeAsync()
        {
            var env = await CoreWebView2Environment.CreateAsync(
                userDataFolder: Path.Combine(
                    Path.GetTempPath(),
                    "EchoBrowser"
                )
            );
            await webView.EnsureCoreWebView2Async(env);

            string app = LoadResource("Echo.WebApp.public.index.html");
            webView.NavigateToString(app);
            webView.CoreWebView2.OpenDevToolsWindow();
        }

        // Keep On top!
        private void MainWindow_Deactivated(object sender, EventArgs e)
        {
            Window window = (Window)sender;
            window.Topmost = true;
        }

        private void WebView_InitializationCompleted(object sender, EventArgs e)
        {
            var dataBroker = Program.Broker;
            var eventForwarder = new EventForwarder(new WindowInteropHelper(this).Handle);
            string preload = LoadResource("Echo.WebApp.dist.preload.js");

            webView.CoreWebView2.Settings.IsStatusBarEnabled = false;
            webView.CoreWebView2.AddHostObjectToScript("dataBroker", dataBroker);
            webView.CoreWebView2.AddHostObjectToScript("eventForwarder", eventForwarder);
            webView.CoreWebView2.AddScriptToExecuteOnDocumentCreatedAsync(preload);
        }

        private void WebView_NavigationCompleted(object sender, EventArgs e)
        {
            // Send React script
            string script = LoadResource("Echo.WebApp.dist.bundle.js");
            webView.ExecuteScriptAsync(script);
        }

        private string LoadResource(string name)
        {
            string data = null;
            var assembly = Assembly.GetExecutingAssembly();
            using (Stream s = assembly.GetManifestResourceStream(name))
            {
                using(StreamReader r = new StreamReader(s))
                {
                    data = r.ReadToEnd();
                }
            }
            return data;
        }
    }
}
