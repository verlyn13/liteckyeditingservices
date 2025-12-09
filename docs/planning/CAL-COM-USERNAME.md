# Cal.com Profile Username Configuration

**Last Updated**: October 16, 2025  
**Status**: ✅ Confirmed

---

## Official Cal.com Profile

**Username**: `litecky-editing`  
**Profile URL**: https://cal.com/litecky-editing  
**Booking URL Format**: https://cal.com/litecky-editing/{event-type}

### Primary Event Type

**Event Name**: Free Consultation  
**Event Slug**: `consultation`  
**Full Booking URL**: https://cal.com/litecky-editing/consultation

---

## Environment Variable Configuration

### Production
```bash
PUBLIC_CALCOM_EMBED_URL=https://cal.com/litecky-editing/consultation
```

### Preview/Development (Test Account)
```bash
PUBLIC_CALCOM_EMBED_URL=https://cal.com/litecky-editing-test/consultation
```

---

## Documentation References

All Cal.com integration documentation uses the correct username `litecky-editing`:

- ✅ `docs/planning/CAL-COM-INTEGRATION-ANALYSIS.md` - All examples use `litecky-editing`
- ✅ `docs/email-templates/` - Generic Cal.com references (no hardcoded usernames)
- ✅ Environment variable examples - Correctly formatted URLs

---

## Historical Note

**Previous Username**: `ahnie-litecky-les` (not used in any documentation)  
**Current Username**: `litecky-editing` (official, documented)  
**Change Date**: Before documentation creation (October 2025)

---

## Verification Checklist

When setting up Cal.com integration, verify:

- [ ] Cal.com profile username is `litecky-editing`
- [ ] Event type slug is `consultation`
- [ ] Full URL is `https://cal.com/litecky-editing/consultation`
- [ ] Environment variable `PUBLIC_CALCOM_EMBED_URL` matches this URL
- [ ] Webhook URL points to `https://www.liteckyeditingservices.com/api/calcom-webhook`
- [ ] API key is generated from the `litecky-editing` account

---

## Related Documentation

- **Integration Analysis**: `docs/planning/CAL-COM-INTEGRATION-ANALYSIS.md`
- **Email Templates**: `docs/email-templates/01-booking-confirmation.md`
- **Implementation Roadmap**: `docs/email-templates/IMPLEMENTATION-ROADMAP.md`
- **Environment Variables**: `ENVIRONMENT.md`
