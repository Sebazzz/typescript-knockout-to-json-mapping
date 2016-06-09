namespace DemoWebsite.Controllers {
    using System.Web.Mvc;
    using Models;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Serialization;

    public class HomeController : Controller {
        public ActionResult Index() {
            return this.View();
        }

        public ActionResult GetQuestions() {
            return new JsonNetResult {
                Data = CreateDataObjects()
            };
        }

        /// <summary>
        ///     Normally I'd do this via web api but I'm just too lazy now :)
        /// </summary>
        private static object CreateDataObjects() {
            return new[] {
                new Question {
                    Id = 1,
                    Order = 1,
                    Text = "How you'd like your breakfast this morning?",
                    Answers = new[] {
                        new Answer {
                            Id = 1,
                            Order = 1,
                            Text = "Cheese on bread"
                        },
                        new Answer {
                            Id = 2,
                            Order = 2,
                            Text = "Baked beans"
                        }
                    },
                    Type = QuestionType.MultipleChoice
                },
                new Question {
                    Id = 2,
                    Order = 2,
                    Text = "Any other concerns?",
                    Answers = new Answer[0],
                    Type = QuestionType.Text
                }
            };
        }
    }

    public sealed class JsonNetResult : ActionResult {
        public object Data { get; set; }

        public override void ExecuteResult(ControllerContext context) {
            var serializer = GetSerializer();

            context.HttpContext.Response.ContentType = "application/json";
            serializer.Serialize(context.HttpContext.Response.Output, this.Data);
        }

        private static JsonSerializer GetSerializer() {
            var serializer = new JsonSerializer();
            serializer.ContractResolver = new CamelCasePropertyNamesContractResolver();
            return serializer;
        }
    }
}