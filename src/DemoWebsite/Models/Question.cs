namespace DemoWebsite.Models {
    public class Question {
        public int Id { get; set; }

        public string Text { get; set; }

        public Answer[] Answers { get; set; }

        public QuestionType Type { get; set; }

        public int Order { get; set; }
    }
}