namespace WebApp.Controllers {
    using Microsoft.AspNetCore.Mvc;

    public class HomeController : Controller {
        public IActionResult Index() {
            return this.View();
        }

        public IActionResult Error() {
            return this.View();
        }

        public IActionResult GetQuestions() {
            return this.Ok(new[] {
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
            });
        }
    }


    public class Question {
        public int Id { get; set; }

        public string Text { get; set; }

        public Answer[] Answers { get; set; }

        public QuestionType Type { get; set; }

        public int Order { get; set; }
    }

    public class Answer {
        public int Id { get; set; }

        public string Text { get; set; }

        public int Order { get; set; }
    }

    public enum QuestionType {
        MultipleChoice,
        Text
    }
}